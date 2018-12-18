<template>
    <div class="component-content margin-10">
        <div class="col-md-12">

            <!-- Панель кнопок -->
            <div class="d-flex justify-content-start">
                <button class="btn btn-success mr-5" @click.prevent="preSaveTrainer">Сохранить</button>

                <button class="btn btn-warning mr-5" @click.prevent="makeVoice = true">Озвучить</button>
                <make-voice 
                        v-if="makeVoice" 
                        @close="makeVoice = false"
                        :kolvo="checkedExamplesLength"
                        :examples_id="checkedExamples"></make-voice>

                <button class="btn btn-info" @click.prevent="uploadScheme = true">Загрузить схему</button>
                <upload-scheme 
                        v-if="uploadScheme" 
                        @close="uploadScheme = false"
                        :kolvo="checkedExamplesLength"
                        @image_uploaded="imageUploaded"></upload-scheme>

                <button class="ml-auto btn btn-danger" @click.prevent="deleteFromTrainer">Удалить</button>
            </div>

            <!-- The Table itself -->
            <table class="table table-bordered table-hover card-sentences-table" v-click-outside="removeActiveId">
                
                <!-- Заголовок таблицы -->
                <thead @click="removeActiveId">
                    <tr class="center">
                        <th class="id-col sizes-min"></th>
                        <th class="en-col">EN (Question)</th>
                        <th class="ru-col">RU (Answer)</th>
                        <th class="scheme-col">Схема</th>
                        <th class="source-col">Источник</th>
                        <th class="exam-col sizes-min">Экзамен</th>
                        <th class="exam-col sizes-min">Плеер</th>
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
                        <td class="en-col quill-table-important" @click="setActiveId(example.id, 'en')">
                            <div class="d-flex">
                                    <div class="width-full">
                                        <quill-editor
                                            v-if="example.id === activeId && activeType === 'en'"
                                            v-model="example.question"
                                            :options="customToolbar"></quill-editor>
                                        <div v-else class="sizes-small" v-html="example.question"></div>
                                    </div>

                                <!-- Озвучка английского текста, если есть -->
                                <div 
                                        v-if="example.question_audio" 
                                        class="material-icons pointer sizes-small ml-auto" 
                                        @click.stop="playAudio(example.question_audio, example.id)">volume_up</div>

                            </div>
                        </td>

                        <!-- Столбец русского текста -->
                        <td class="ru-col quill-table-important" @click="setActiveId(example.id, 'ru')">
                            <div class="d-flex">
                                <div class="width-full">
                                    <quill-editor
                                        v-if="example.id === activeId && activeType === 'ru'"
                                        v-model="example.answer"
                                        :options="customToolbar"></quill-editor>
                                    <div v-else class="sizes-small" v-html="example.answer"></div>
                                </div>
                                

                                <!-- Озвучка русского текста, если есть -->
                                <div 
                                        v-if="example.answer_audio" 
                                        class="material-icons pointer sizes-small ml-auto" 
                                        @click.stop="playAudio(example.answer_audio, example.id)">volume_up</div>
                            </div>
                        </td>
                        
                        <!-- Столбец выбора схемы -->
                        <td class="scheme-col center" @click="removeActiveId">
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

                        <!-- Столбец указания источника -->
                        <td class="desc-col sizes-small">
                            <div class="d-flex">
                                <input
                                        type="text"
                                        id="ru"
                                        class="form-control font-input"
                                        placeholder="Источник"
                                        v-model="example.source"/>
                            </div>
                        </td>

                        <!-- Столбец выбора использования в экзамене -->
                        <td class="exam-col sizes-min center" @click="example.use_for_exam = !example.use_for_exam">
                            <i class="material-icons pointer" v-if="!example.use_for_exam">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </td>

                        <!-- Столбец выбора использования в плеере -->
                        <td class="exam-col sizes-min center" @click="example.use_for_player = !example.use_for_player">
                            <i class="material-icons pointer" v-if="!example.use_for_player">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
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
    import { HTTP } from '../../http-common.js'
    import UploadScheme from '../Elements/Modals/UploadScheme.vue'
    import SelectScheme from '../Elements/Modals/SelectScheme.vue'
    import MakeVoice from './Modals/MakeVoice.vue'
    import ClickOutside from 'vue-click-outside'
    import '../Elements/v-html_styles.css'

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
                makeVoice: false,
                activeId: -1,
                activeType: "",
                customToolbar: {
                    modules: {
                        toolbar: [
                            [{'color': []}]
                        ]
                    }
                }
            };
        },

        components: {
            UploadScheme,
            SelectScheme,
            MakeVoice
        },

        directives: {
            ClickOutside
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
                if (colRows === 0) colRows = 1
                return colRows;
            },

            // Запись id активного quill-редактора
            setActiveId(id, type) {
                this.activeId = id;
                this.activeType = type;
            },

            // Закрытие всех quill-редакторов
            removeActiveId() {
                this.activeId = -1;
                this.activeType == "";
            },
            
            // Подготовка к сохранению данных, проверка, не пропущены ли вопрос и ответ
            preSaveTrainer() {
                let permission = true;
                this.examples.forEach((example) => {
                    if (!example.question || !example.answer) permission = false
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
                }
            },

            dealWithExtraP(str) {
                let pos = 0;
                while (true) {
                    let foundPos = str.indexOf('<p>', pos);
                    if (foundPos === -1) break

                    let strPart1 = str.slice(0, foundPos);
                    let strPart2 = str.slice(foundPos + 3, str.length);
                    str = strPart1 + strPart2;
                    pos = foundPos;
                }

                pos = 0;
                while (true) {
                    let foundPos = str.indexOf('</p>', pos);
                    if (foundPos === -1) break

                    let strPart1 = str.slice(0, foundPos);
                    let strPart2 = str.slice(foundPos + 4, str.length);
                    str = strPart1 + ' ' + strPart2;
                    pos = foundPos + 1;
                }

                pos = 0;
                while (true) {
                    let foundPos = str.indexOf('<br>', pos);
                    if (foundPos === -1) break

                    let strPart1 = str.slice(0, foundPos);
                    let strPart2 = str.slice(foundPos + 4, str.length);
                    str = strPart1 + ' ' + strPart2;
                    pos = foundPos + 1;
                }

                str.replace(/\s+/g, " ");
                if (str[str.length] === ' ') {
                    str = str.slice(0, str.length - 1);
                }

                return str;
            },

            // Сохранение данных тренажёра на сервере
            saveTrainer() {
                let presavedExamples = this.examples;
                presavedExamples.forEach((example) => {
                    delete example.checked;  
                    example.question = this.dealWithExtraP(example.question);
                    example.answer = this.dealWithExtraP(example.answer);
                });
                
                // Удаление временных id, если они есть
                if (this.newExampleDetected) {
                    presavedExamples.forEach((example) => {
                        if (example.id < -1) delete example.id
                    });
                }

                HTTP.put(`editor/cards/${this.url_id}/examples/`, presavedExamples)
                    .then(response => {
                        if (this.newExampleDetected) {
                            this.examples = response.data;
                            this.newExampleDetected = false;
                            this.initTrainer();
                        }
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
                        }
                    });
                    this.examples = tmpExamples;
                }
            },

            // Добавление загруженного изображения в список
            imageUploaded(imageData) {
                this.ulpoadedImages.push(imageData);
                let allSchemes = this.checkAllSchemes();
                this.$emit('exampleImagesChanged', allSchemes);
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
                    source: null,
                    use_for_exam: false,
                    use_for_player: false,
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
                    }
                });
                this.checkAllSchemes();
                this.$emit('exampleImagesChanged', this.imagesFromTrainer);
            },

            // Отмечаем / снимаем отметку с примера
            checkExample(example) {
                if (example.checked) this.removeExampleChecked(example.id)
                    else this.addExampleChecked(example.id)
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
            playAudio(source, id) {
                if (id != this.activeId) {
                    this.removeActiveId();
                }
                if (this.snd) {
                    this.snd.pause();
                }
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
                    }
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
                        }
                    }
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
                    console.log(this.card_aams);
                    this.initTrainer();
                    this.firstAamssGetting = false;
                }
            }
        }
    }
</script>

<style scoped>
    /*.vertical-text {
        -webkit-transform: rotate(-90deg);
        -moz-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        transform: rotate(-90deg);
        writing-mode: vertical-lr;
        padding-top: 0;
        padding-bottom: 0;
        vertical-align: middle;
    }*/

    .width-full {
        width: 100%;
    }

    .quill-table-important {
        padding: 0!important;
    }

    .sizes-small {
        padding-right: 3px;
        padding-left: 3px;
    }

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

    .exam-col {
        width: 3%;
    }

    .source-col {
        width: 15%;
    }
</style>

