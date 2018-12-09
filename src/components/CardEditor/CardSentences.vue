<template>
    <div class="component-content margin-10">
        <div class="col-md-12">

            <!-- Панель кнопок -->
            <div class="d-flex justify-content-start">
                <div class="btn btn-success mr-5" @click="preSaveTrainer">Сохранить</div>

                <div class="btn btn-warning mr-5" @click="makeVoice = true">Озвучить</div>
                <make-voice 
                        v-if="makeVoice" 
                        @close="makeVoice = false"
                        :kolvo="checkedExamplesLength"
                        :examples_id="checkedExamples"></make-voice>

                <div class="btn btn-info" @click="uploadScheme = true">Загрузить схему</div>
                <upload-scheme 
                        v-if="uploadScheme" 
                        @close="uploadScheme = false"
                        :kolvo="checkedExamplesLength"
                        @image_uploaded="imageUploaded"></upload-scheme>

                <div class="ml-auto btn btn-danger" @click="deleteFromTrainer">Удалить</div>
            </div>

            <!-- The Table itself -->
            <table class="table table-bordered table-hover card-sentences-table">
                
                <!-- Заголовок таблицы -->
                <thead>
                    <tr class="center">
                        <th class="id-col sizes-min"></th>
                        <th class="en-col">EN (Question)</th>
                        <th class="ru-col">RU (Answer)</th>
                        <th class="scheme-col">Схема</th>
                        <th class="practice-col sizes-min">Практика?</th>
                        <th class="exam-col sizes-min">Экзамен?</th>
                    </tr>
                </thead>
                
                <!-- Тело таблицы, по примеру -->
                <tbody v-for="(example, index) in examples" :key="index">
                    <tr :class="{active: index % 2 === 0}">
                        
                        <!-- Столбец выбора примеров -->
                        <th class="id-col sizes-min center" scope="row" @click="checkExample(example)">
                            <i class="material-icons pointer" v-if="!checkedExamples.find(x => x === example.id)">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </th>

                        <!-- Столбец английского текста -->
                        <td class="en-col">
                            <div class="d-flex">
                                <textarea
                                        type="text"
                                        id="en"
                                        class="form-control font-textarea"
                                        :rows="1"
                                        placeholder="EN (Question)"
                                        v-autosize="example.question"
                                        v-model="example.question"></textarea>

                                <!-- Озвучка английского текста, если есть -->
                                <div 
                                        v-if="example.question_audio" 
                                        class="material-icons pointer" 
                                        @click="playAudio(example.question_audio)">volume_up</div>

                            </div>
                        </td>

                        <!-- Столбец русского текста -->
                        <td class="ru-col">
                            <div class="d-flex">
                                <textarea
                                        type="text"
                                        id="ru"
                                        class="form-control font-textarea"
                                        :rows="countRows(example.answer)"
                                        placeholder="RU (Answer)"
                                        v-autosize="example.answer"
                                        v-model="example.answer"></textarea>

                                <!-- Озвучка русского текста, если есть -->
                                <div 
                                        v-if="example.answer_audio" 
                                        class="material-icons pointer" 
                                        @click="playAudio(example.answer_audio)">volume_up</div>
                            </div>
                        </td>
                        
                        <!-- Столбец выбора схемы -->
                        <td class="scheme-col center">
                            <div v-if="example.image" class="d-flex justify-content-center">
                                <figure class="ml-auto">
                                    <img :src="example.image.url" alt="..." class="img-fluid height-max">
                                </figure>
                                <div class="material-icons pointer ml-auto" @click="example.image = ''">close</div>
                            </div>
                            <div v-else>
                                <div class="btn btn-outline-secondary" @click="{selectScheme = true; selectIndex = index}">Выберите схему</div>
                                <select-scheme 
                                        v-if="selectScheme"
                                        :schemes="checkAllSchemes()"
                                        @close="selectScheme = false"
                                        @scheme_selected="schemeSelected"></select-scheme>
                            </div>
                        </td>

                        <!-- Столбец выбора использования в практике -->
                        <td class="practice-col sizes-min center" @click="example.use_for_practice = !example.use_for_practice">
                            <i class="material-icons pointer" v-if="!example.use_for_practice">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </td>

                        <!-- Столбец выбора использования в экзамене -->
                        <td class="exam-col sizes-min center" @click="example.use_for_exam = !example.use_for_exam">
                            <i class="material-icons pointer" v-if="!example.use_for_exam">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </td>

                    </tr>
                </tbody>

            </table>

            <!-- Кнопка добавления новой строки -->
            <div class="center">
                <div class="btn btn-green btn-oval create-btn" @click="createNew">Добавить</div>
            </div>

        </div>
    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';
    import UploadScheme from '../Elements/Modals/UploadScheme.vue';
    import SelectScheme from '../Elements/Modals/SelectScheme.vue';
    import MakeVoice from './Modals/MakeVoice.vue';

    export default {
        props: ['url_id', 'card_aams', 'ready'],

        data() {
            return {
                examples: [],
                firstAamsGetting: true,
                uploadScheme: false,
                selectScheme: false,
                checkedExamples: [],
                ulpoadedImages: [],
                currentTmpId: -2,
                newExampleDetected: false,
                selectIndex: Number,
                checkedExamplesLength: 0,
                imagesFromTrainer: [],
                makeVoice: false
            };
        },

        components: {
            UploadScheme,
            SelectScheme,
            MakeVoice
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
            
            // Рассчёт количества строк текстарии
            countRows(text) {
                let textMeasure = this.getTextWidth(text, "400 1rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");
                let colRows = Math.ceil(textMeasure / 227); // 231
                if (colRows === 0) colRows = 1;
                return colRows;
            },
            
            // Подготовка к сохранению данных, проверка, не пропущены ли вопрос и ответ
            preSaveTrainer() {
                let permission = true;
                this.examples.forEach((example) => {
                    if (!example.question || !example.answer) permission = false;
                });
                if (permission) {
                    this.saveTrainer();
                } else {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Сохранение недоступно',
                        text: 'Заполните поля Question и Answer!'
                    });
                };
            },

            // Сохранение данных тренажёра на сервере
            saveTrainer() {
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

                HTTP.put(`editor/cards/${this.url_id}/examples/`, presavedExamples)
                    .then(response => {
                        if (this.newExampleDetected) {
                            this.examples = response.data;
                            this.newExampleDetected = false;
                            this.initTrainer();
                        };
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Тренажёр загружен на сервер'
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
            deleteFromTrainer() {
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
                    question: "",
                    question_audio: "",
                    answer: "",
                    answer_audio: "",
                    image: "",
                    use_for_exam: false,
                    use_for_practice: false,
                    checked: false
                };
                this.newExampleDetected = true;
                this.currentTmpId -= 1;
                this.examples.push(newExample);
            },

            // Выполняется при инициализации: добавляем свойство выбрано/нет, добавляем изображения в список загруженных
            initTrainer() {
                this.imagesFromTrainer = [];
                this.checkedExamples = [];
                this.examples.forEach((example) => {
                    example.checked = false;
                    if (example.image) {
                        this.imagesFromTrainer.push(example.image);
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

            // Воспроизведение аудио
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                };
                this.snd = new Audio(source);
                this.snd.play();
            },
            
            // Проверка списка загруженных файлов с целью исключения дублирования
            checkAllSchemes() {
                let oldAllSchemes = [...this.ulpoadedImages, ...this.imagesFromTrainer];
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
                        if (this.firstAamsGetting) {
                            this.examples = this.card_aams;
                            this.initTrainer();
                            this.firstAamsGetting = false;
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
                if (this.firstAamsGetting) {
                    this.examples = this.card_aams;
                    this.initTrainer();
                    this.firstAamssGetting = false;
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
        width: 3%;
    }

    .en-col {
        width: 25%;
    }

    .ru-col {
        width: 25%;
    }

    .scheme-col {
        width: 25%;
    }

    .practice-col {
        width: 5%;
    }

    .exam-col {
        width: 5%;
    }
</style>

