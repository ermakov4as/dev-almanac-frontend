<template>
    <div class="component-content margin-10">
        <div class="col-md-12">

            <!-- Панель кнопок -->
            <div class="d-flex justify-content-start">
                <div class="btn btn-success mr-5" @click="saveTrainer">Сохранить</div>
                <div class="btn btn-warning mr-5" @click="voice">Озвучить</div>

                <div class="btn btn-info" @click="uploadScheme = true">Загрузить схему</div>
                <upload-scheme 
                        v-if="uploadScheme" 
                        @close="uploadScheme = false"
                        :kolvo="checkedExamples.length"
                        @image_uploaded="imageUploaded"></upload-scheme>

                <div class="ml-auto btn btn-danger" @click="deleteFromTrainer">Удалить</div>
            </div>

            <!-- The Table itself -->
            <table class="table table-bordered table-hover card-sentences-table">
                
                <thead>
                    <tr class="center">
                        <th class="id-col"></th>
                        <th class="en-col">EN (Question)</th>
                        <th class="ru-col">RU (Answer)</th>
                        <th class="scheme-col">Схема</th>
                        <th class="practice-col">Практика?</th>
                        <th class="exam-col">Экзамен?</th>
                    </tr>
                </thead>
                
                <tbody v-for="(example, index) in examples" :key="index">
                    <tr :class="{active: index % 2 === 0}">

                        <th class="id-col center" scope="row">
                            <i class="material-icons pointer" v-if="!example.checked">check_box_outline_blank</i>
                            <i class="material-icons pointer" v-else>check_box</i>
                        </th>

                        <td class="en-col">
                            <input
                                type="text"
                                id="en"
                                class=""
                                v-model="example.question">
                        </td>
                        <td class="ru-col">
                            <input
                                type="text"
                                id="ru"
                                class=""
                                v-model="example.answer">
                        </td>
                        <td class="scheme-col center">4</td>
                        <td class="practice-col center">5</td>
                        <td class="exam-col center">6</td>
                    </tr>
                </tbody>

            </table>

            <!-- Кнопка добавления новой строки -->
            <div class="center">
                <div class="btn btn-green btn-oval create-btn" @click="createNew">Добавить</div>
            </div>

        </div>
    </div>
        

                        <!--<tr class="sentences_row">
                        <td colspan="8">
                            <div class="d-flex align-items-center justify-content-center">
                                <table class="table table-sm table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Статус</th>
                                        <th>На английском</th>
                                        <th>На русском</th>
                                        <th>Дата создания</th>
                                    </tr>
                                    </thead>
                                    <tbody v-for="sentence in lesson['sentences']">
                                    <tbody>
                                    <tr>
                                        <td v-if="sentence.accepted">
                                            <i class="material-icons">done</i>
                                        </td>
                                        <td v-else-if="sentence.checked">
                                            <i class="material-icons">clear</i>
                                        </td>
                                        <td v-else>
                                            <i class="material-icons">schedule</i>
                                        </td>
                                        <td @click="playAudio(sentence.question_audio)" class="sentence_td"
                                            v-if="sentence.question_audio">
                                            <div class="d-flex">
                                                <div class="text-left">{{sentence.question}}</div>
                                                <div class="ml-auto"><i class="material-icons">volume_up</i></div>
                                            </div>
                                        </td>
                                        <td class="sentence_td" v-else>
                                            <div class="d-flex">
                                                <div class="text-left">{{sentence.question}}</div>
                                            </div>
                                        </td>
                                        <td @click="playAudio(sentence.answer_audio)" class="sentence_td"
                                         v-if="sentence.answer_audio">
                                            <div class="d-flex">
                                                <div class="text-left">{{sentence.answer}}</div>
                                                <div class="ml-auto"><i class="material-icons">volume_up</i></div>
                                            </div>
                                        </td>
                                        <td class="sentence_td" v-else>
                                            <div class="d-flex">
                                                <div class="text-left">{{sentence.answer}}</div>
                                            </div>
                                        </td>
                                        <td>{{get_datetime(sentence.date_created)}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </td>
                    </tr>-->
</template>

<script>
    import { HTTP } from '../../http-common.js';
    import UploadScheme from './Modals/UploadScheme.vue';

    export default {
        props: ['url_id', 'card_aams', 'ready'],

        data() {
            return {
                examples: [],
                firstAamsGetting: true,
                uploadScheme: false,
                checkedExamples: [],
                ulpoadedImages: []
            };
        },

        components: {
            UploadScheme
        },

        methods: {
            // Сохранение данных тренажёра на сервере
            saveTrainer() {
                let presavedExamples = this.examples;
                presavedExamples.forEach((example) => {
                    delete example.checked;
                });
                console.log(presavedExamples);
                HTTP.put(`editor/cards/${this.url_id}/examples/`, presavedExamples)
                    .then(response => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Урок загружен на сервер'
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

            voice() {

            },

            deleteFromTrainer() {

            },

            imageUploaded(imageData) {
                this.ulpoadedImages.push(imageData);
                //console.log(this.ulpoadedImages);
            },
            
            createNew() {
                let newExample = {
                    question: "qqq",
                    question_audio: "",
                    answer: "qqq",
                    answer_audio: "",
                    image: "",
                    use_for_exam: false,
                    use_for_practice: false,
                    checked: false
                };
                this.examples.push(newExample);
            },

            initTrainer() {
                this.examples = this.card_aams;
                this.examples.forEach((example) => {
                    example.checked = false;
                });
                console.log(this.examples);
            }
        },

        watch: {
            // Отслеживание готовности данных
            ready: {
                handler(val, oldVal) {
                    if (this.ready) {
                        if (this.firstAamsGetting) {
                            this.initTrainer();
                            this.firstAamsGetting = false;
                        };
                    };
                }
            }
        },

        mounted() {
            if (this.ready) {
                if (this.firstAamsGetting) {
                    this.initTrainer();
                    this.firstAamssGetting = false;
                };
            };
        }
    }
</script>

<style scoped>
    .active {
        background-color: ghostwhite;
    }

    .active:hover {
        background-color: lightgrey;
    }

    .card-sentences-table {
        margin-top: 15px;
        margin-bottom: -5px;
    }

    .id-col {
        width: 5%;
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
        width: 10%;
    }

    .exam-col {
        width: 10%;
    }
</style>

