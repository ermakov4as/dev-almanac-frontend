<template>
    <div class="component-content margin-10">
        <div class="col-md-12">

            <!-- Панель кнопок -->
            <div class="d-flex justify-content-start">
                <button class="btn btn-success mr-5" @click.prevent="preSavePractice">Сохранить</button>

                <button class="btn btn-info" @click.prevent="uploadScheme = true">Загрузить схему</button>
                <upload-scheme 
                        v-if="uploadScheme" 
                        @close="uploadScheme = false"
                        :kolvo="checkedExamplesLength"
                        @image_uploaded="imageUploaded"></upload-scheme>

                <button class="ml-auto btn btn-danger" @click.prevent="deleteFromPractice">Удалить</button>
            </div>

            <!-- The Table itself -->
            <table class="table table-bordered table-hover card-sentences-table">
                
                <!-- Заголовок таблицы -->
                <thead>
                    <tr class="center">
                        <th class="id-col sizes-min"></th>
                        <th class="scheme-col">Схема</th>
                        <th class="desc-col">Описание</th>
                    </tr>
                </thead>
                
                <!-- Тело таблицы, по примерам -->
                <tbody v-for="(example, index) in examples" :key="index">
                    <tr :class="{active: index % 2 === 0}">

                        <!-- Столбец выборки -->
                        <th class="id-col sizes-min center" scope="row" @click="checkExample(example)">
                            <i class="material-icons pointer" v-if="!checkedExamples.find(x => x === example.id)">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </th>
                        
                        <!-- Столбец выбора схемы -->
                        <td class="scheme-col center">
                            <div v-if="example.image" class="d-flex justify-content-center">
                                <figure class="ml-auto">
                                    <img :src="example.image.url" alt="..." class="img-fluid height-max">
                                </figure>
                                <div class="material-icons pointer ml-auto" @click="example.image = ''">close</div>
                            </div>
                            <div v-else>
                                <button 
                                        class="btn btn-outline-secondary" 
                                        @click.prevent="{selectScheme = true; selectIndex = index}">Выберите схему</button>
                                <select-scheme 
                                        v-if="selectScheme"
                                        :schemes="checkAllSchemes()"
                                        @close="selectScheme = false"
                                        @scheme_selected="schemeSelected"></select-scheme>
                            </div>
                        </td>

                        <!-- Столбец описания -->
                        <td class="desc-col">
                            <div class="d-flex">
                                <textarea
                                        type="text"
                                        id="ru"
                                        class="form-control font-textarea"
                                        :rows="countRows(example.description)"
                                        placeholder="Текстовое описание"
                                        v-autosize="example.description"
                                        v-model="example.description"></textarea>
                            </div>
                        </td>

                    </tr>
                </tbody>

            </table>

            <!-- Кнопка добавления новой строки -->
            <div class="center">
                <button class="btn btn-green btn-oval create-btn" @click.prevent="createNew">Добавить</button>
            </div>

        </div>
    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';
    import UploadScheme from '../Elements/Modals/UploadScheme.vue';
    import SelectScheme from '../Elements/Modals/SelectScheme.vue';

    export default {
        props: ['url_id', 'practice_tasks', 'ready'],

        data() {
            return {
                examples: [],
                firstGetting: true,
                uploadScheme: false,
                selectScheme: false,
                checkedExamples: [],
                ulpoadedImages: [],
                currentTmpId: -2,
                newExampleDetected: false,
                selectIndex: Number,
                checkedExamplesLength: 0,
                imagesFromPractice: []
            };
        },

        components: {
            UploadScheme,
            SelectScheme
        },

        methods: {
            // Вычисление ширины строки
            getTextWidth(text, font) {
                let canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
                let context = canvas.getContext("2d");
                context.font = font;
                let metrics = context.measureText(text);
                return metrics.width;
            },
            
            // Расчёт количества строк текстарии
            countRows(text) {
                let textMeasure = this.getTextWidth(text, "400 1rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");
                let colRows = Math.ceil(textMeasure / 445); // 450
                if (colRows === 0) colRows = 1;
                return colRows;
            },

            // Подготовка к сохранению данных, проверка, не пропущено ли изображение в примерах
            preSavePractice() {
                let permission = true;
                this.examples.forEach((example) => {
                    if (!example.image) permission = false;
                });
                if (permission) {
                    this.savePractice();
                } else {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Сохранение недоступно',
                        text: 'Добавьте схему!'
                    });
                };
            },

            // Сохранение данных практики на сервере
            savePractice() {
                let presavedExamples = this.examples;
                presavedExamples.forEach((example) => {
                    delete example.checked;
                });

                // Удаление временных id, если они есть
                if (this.newExampleDetected) {
                    presavedExamples.forEach((example) => {
                        if (example.id < -1) delete example.id
                    });
                };

                HTTP.put(`editor/lessons/${this.url_id}/practice_tasks/`, presavedExamples)
                    .then(response => {
                        if (this.newExampleDetected) {
                            this.examples = response.data;
                            this.newExampleDetected = false;
                            this.initPractice();
                        };
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Практика загружена на сервер'
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.$notify({
                            group: 'foo',
                            type: "error",
                            title: 'Произошла ошибка',
                            text: 'Sorry'
                        });
                    });
            },

            // Удаление выделенных примеров из локальных данных с подтверждением
            deleteFromPractice() {
                if (confirm(`Удалить выбранные записи (${this.checkedExamplesLength})?`)) {
                    let tmpExamples = [];
                    this.examples.forEach((example) => {
                        if (!this.checkedExamples.find(x => x === example.id)) {
                            tmpExamples.push(example);
                        };
                    });
                    this.examples = tmpExamples;
                };
            },

            // Добавление загруженного изображения в список
            imageUploaded(imageData) {
                this.ulpoadedImages.push(imageData);
            },

            // Добавление выбранного изображения в конкретный пример
            schemeSelected(selectedScheme) {
                this.examples[this.selectIndex].image = selectedScheme;
            },
            
            // Добавление нового примера
            createNew() {
                let newExample = {
                    id: this.currentTmpId,
                    description: "",
                    image: "",
                    checked: false
                };
                this.newExampleDetected = true;
                this.currentTmpId -= 1;
                this.examples.push(newExample);
            },

            // Выполняется при инициализации: добавляем свойство выбрано/нет, добавляем изображения в список загруженных
            initPractice() {
                this.imagesFromPractice = [];
                this.checkedExamples = [];
                this.examples.forEach((example) => {
                    example.checked = false;
                    if (example.image) {
                        this.imagesFromPractice.push(example.image);
                    };
                });
            },
            
            // Отмечаем / снимаем отметку с примера
            checkExample(example) {
                if (example.checked) this.removeExampleChecked(example.id)
                    else this.addExampleChecked(example.id);
                example.checked = !example.checked;
            },

            // Исключение примера из списка выбранных
            removeExampleChecked(id) {
                let index = this.checkedExamples.indexOf(id);
                this.checkedExamples.splice(index, 1);
            },

            // Добавление примера в список выбранных
            addExampleChecked(id) {
                this.checkedExamples.push(id);
            },

            // Проверка списка загруженных файлов с целью исключения дублирования
            checkAllSchemes() {
                let oldAllSchemes = [...this.ulpoadedImages, ...this.imagesFromPractice];
                let newAllSchemes = [];
                let allSchemesId = [];
                oldAllSchemes.forEach((image) => {
                    if (!allSchemesId.find(x => x === image.id)) {
                        allSchemesId.push(image.id);
                        newAllSchemes.push(image);
                    };
                });
                return newAllSchemes;
            }
        },

        watch: {
            // Отслеживание готовности данных (вариант на случай задержки родительского компонента), инициализация данных
            ready: {
                handler(val, oldVal) {
                    if (this.ready) {
                        if (this.firstGetting) {
                            this.examples = this.practice_tasks;
                            this.initPractice();
                            this.firstGetting = false;
                        };
                    };
                }
            },

            // Отслеживание количества выбранных примеров
            checkedExamples: {
                handler(val, oldVal) {
                    this.checkedExamplesLength = this.checkedExamples.length;
                }
            }
        },

        // Инициализация данных
        mounted() {
            if (this.ready) {
                if (this.firstGetting) {
                    this.examples = this.practice_tasks;
                    this.initPractice();
                    this.firstGetting = false;
                };
            };
        }
    }
</script>

<style scoped>
    .font-textarea {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .sizes-min {
        padding-right: 0px;
        padding-left: 0px;
    }

    .height-max {
        max-height: 215px;
    }

    textarea {
        border: none;
        background-color: transparent;
        resize: none;
    }

    .active {
        background-color: ghostwhite;
    }

    .active:hover {
        background-color: lightgrey;
    }

    .card-sentences-table {
        margin-top: 15px;
        margin-bottom: -5px;
        vertical-align: middle;
    }

    .id-col {
        width: 4%;
    }

    .desc-col {
        width: 48%;
    }

    .scheme-col {
        width: 48%;
    }
</style>

