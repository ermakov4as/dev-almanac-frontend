<template>
    <div>
        <h1 class="component-title">Проверка домашнего задания</h1>
        
        <!-- Отображение спиннера, если нет соединения с сервером -->
        <!-- При div почему-то не работает... -->
        <p class="text-center" v-if="!dataReady">
            <i class='fa fa-spinner fa-pulse fa-4x'></i>
        </p>
        
        <!-- Гиперблок потоков, если есть соединение с сервером -->
        <div class="component-content" v-else>
            <div v-for="(stream, streamIndex) in streams" :key="streamIndex">     
                <div class="form-group elements-list-margin" @click="stream.showStream = !stream.showStream">
                    <div class="label-subtitle stream">
                        <h3>Поток: {{ stream.name }}
                            <!--<span @click="stream.showStream = !stream.showStream" class="show-element elements-list-margin hover-bolder-main">
                                {{ stream.showStream ? 'Скрыть' : 'Показать' }}
                            </span>-->
                        </h3>
                    </div>
                </div>

                <div v-if="stream.showStream" v-for="(lesson, lessonIndex) in stream.lessons" :key="lessonIndex">
                    <div class="form-group elements-list-margin" @click="lesson.showLesson = !lesson.showLesson">
                        <div class="label-subtitle lesson">
                            <h5>Урок: {{ lesson.name }}
                                <!--<span @click="lesson.showLesson = !lesson.showLesson" class="show-element elements-list-margin hover-bolder">
                                    {{ lesson.showLesson ? 'Скрыть' : 'Показать' }}
                                </span>-->
                            </h5>
                        </div>
                    </div>

                    <div v-if="lesson.showLesson" v-for="(image, imageIndex) in lesson.images" :key="imageIndex">
                        <div v-if="lesson.images != ''" class="d-flex justify-content-center">
                            <img :src="image.image_url" alt="..." class="img-fluid height-max">
                        </div>
                        
                        <table class="table table-bordered table-hover curator-table">
                            <thead>
                                <tr class="center">
                                    <th class="sizes-min">Имя студента</th>
                                    <th class="sizes-min">Группа</th>
                                    <!--<th class="date-col vsizes-min">Дата создания</th>-->
                                    <th class="lang-col">EN</th>
                                    <th class="lang-col">RU</th>
                                    <th class="sizes-min">Правильно</th>
                                    <th width="200">Комментарий</th>
                                    <th class="sizes-min"></th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                <!--<tr :class="{active: index % 2 === 0}">-->
                                <tr v-for="(attempt, attemptIndex) in image.attempts" :key="attemptIndex">
                                    <template v-if="!attempt.checked">

                                        <td class="center sizes-min" scope="row">{{ attempt.name }}</td>
                                        <td class="center sizes-min" scope="row">{{ attempt.team }}</td>
                                        
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.question }}
                                                <div 
                                                        v-if="attempt.question_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.question_audio)">volume_up</div>
                                            </div>
                                        </td>

                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.answer }}
                                                <div 
                                                        v-if="attempt.answer_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.answer_audio)">volume_up</div>
                                            </div>
                                        </td>

                                        <td class="sizes-min center" @click="attempt.accepted = !attempt.accepted">
                                            <i class="material-icons pointer" v-if="!attempt.accepted">clear</i>
                                            <i class="material-icons pointer" v-else>done</i>
                                        </td>

                                        <td>
                                            <textarea
                                                    type="text"
                                                    id='comment'
                                                    class="form-control font-textarea"
                                                    :rows="countRows(attempt.comment)"
                                                    placeholder="Комментарий"
                                                    v-autosize="attempt.comment"
                                                    v-model="attempt.comment"></textarea>
                                        </td>

                                        <td class="sizes-min align-middle">
                                            <div class="btn btn-success" @click="saveAttempt(attempt)">Сохранить</div>
                                        </td>
                                    </template>
                                </tr>

                                <tr>
                                    <td colspan="7" @click="image.showChecked = !image.showChecked">
                                        <span class="checked-label">Проверенные: </span>
                                        <span class="show-hide">{{ image.showChecked ? 'Скрыть' : 'Показать' }}</span>
                                    </td>
                                </tr>

                                <tr v-if="image.showChecked" v-for="(attempt, attemptIndex) in image.attempts" :key="(attemptIndex*(-1))-1" class="checked">
                                    <template v-if="attempt.checked">

                                        <td class="center sizes-min" scope="row">{{ attempt.name }}</td>
                                        <td class="center sizes-min" scope="row">{{ attempt.team }}</td>
                                        
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.question }}
                                                <div 
                                                        v-if="attempt.question_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.question_audio)">volume_up</div>
                                            </div>
                                        </td>

                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.answer }}
                                                <div 
                                                        v-if="attempt.answer_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.answer_audio)">volume_up</div>
                                            </div>
                                        </td>

                                        <td class="sizes-min center" @click="attempt.accepted = !attempt.accepted">
                                            <!--<i class="material-icons pointer" v-if="!attempt.accepted">check_box_outline_blank</i>
                                            <i class="material-icons pointer" v-else>check_box</i>-->
                                            <i class="material-icons pointer" v-if="!attempt.accepted">clear</i>
                                            <i class="material-icons pointer" v-else>done</i>
                                        </td>

                                        <td>
                                            <textarea
                                                    type="text"
                                                    id='comment'
                                                    class="form-control font-textarea"
                                                    :rows="countRows(attempt.comment)"
                                                    placeholder="Комментарий"
                                                    v-autosize="attempt.comment"
                                                    v-model="attempt.comment"></textarea>
                                        </td>

                                        <td class="sizes-min align-middle">
                                            <div class="btn btn-success" @click="saveAttempt(attempt)">Сохранить</div>
                                        </td>
                                
                                    </template>
                                </tr>


                            </tbody>
                        </table>

                    </div>

                    <div 
                            v-if="lesson.showLesson"
                            @click="lesson.showLesson = !lesson.showLesson" 
                            class="only-hide">Cвернуть урок "{{ lesson.name }}"</div>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { HTTP } from '../http-common.js';

    export default {
        data() {
            return {
                dataReady: false,
                streams: {},
                dataLoaded: false
            }
        },

        methods: {
            saveAttempt(attempt) {
                let savingAttempt ={
                    id: attempt.id,
                    accepted: attempt.accepted,
                    comment: attempt.comment
                };
                if (attempt.comment === "") {
                    savingAttempt.comment = null;
                };
                HTTP.put('/staff/curator/сheck_attempt/', savingAttempt)
                    .then(response => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Данные отправлены на сервер'
                        });
                        //console.log(response.data);
                        attempt.checked = true;
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

            initStreams() {
                this.streams.forEach((stream) => {
                    this.$set(stream, 'showStream', false);
                    stream.lessons.forEach((lesson) => {
                        this.$set(lesson, 'showLesson', false);
                        lesson.images.forEach((image) => {
                            //image.showChecked = false;
                            this.$set(image, 'showChecked', false); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        });
                    });
                });
            },

            /*getElementWidth(id) {
                let element = document.getElementById('comment');
                console.log(element);
                let positionInfo = element.getBoundingClientRect();
                let width = positionInfo.width;
                return width;
            },*/

            getTextWidth(text, font) {
                // re-use canvas object for better performance
                let canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
                let context = canvas.getContext("2d");
                context.font = font;
                let metrics = context.measureText(text);
                //return Math.ceil(metrics.width);
                //console.log(metrics.width);
                return metrics.width;
            },
            
            countRows(text) {
                //let colRows = Math.ceil(text.length / 30);
                let textMeasure = this.getTextWidth(text, "400 1rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");
                //let elementWidth = this.getElementWidth();
                //console.log(elementWidth);
                //console.log(id);
                //let test = this.$refs.prev.clientWidth;
                //console.log(test);
                let colRows = Math.ceil(textMeasure / 165); //175.20 //145
                //console.log(colRows);
                if (colRows === 0) colRows = 1;
                //console.log(this.getTextWidth(text, "400 1rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"));
                //console.log(colRows);
                return colRows;
            },

            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                };
                this.snd = new Audio(source);
                this.snd.play();
            },

            getData() {
                HTTP.get('/staff/curator/attempt_list/')
                    .then(response => {
                        this.streams = response.data;
                        this.dataLoaded = true;
                        //this.dataReady = true;
                        //this.initStreams();                           
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
            }
        },

        watch: {
            dataLoaded: {
                handler(val, oldVal) {
                    if (this.dataLoaded) {
                        //console.log('hi');
                        this.initStreams();
                        this.dataReady = true;
                        /*this.streams.forEach((stream) => {
                            stream.lessons.forEach((lesson) => {
                                lesson.images.forEach((image) => {
                                    image.attempts.forEach((attempt) => {
                                        if (attempt.comment === null) {
                                            attempt.comment = "";
                                        };
                                        attempt.comment += ' ';
                                    });
                                });
                            });
                        });*/
                        /*setTimeout(() => {
                            this.streams.forEach((stream) => {
                                stream.lessons.forEach((lesson) => {
                                    lesson.images.forEach((image) => {
                                        image.attempts.forEach((attempt) => {
                                            let length = attempt.comment.length;
                                            let comment = attempt.comment.slice(0, -1);
                                            attempt.comment = comment;
                                            console.log(comment);
                                        });
                                    });
                                });
                            });
                        }, 4)*/
                    };
                }
            }
        },

        created() {
            this.getData();
        }
    }
</script>

<style scoped>
    .only-hide {
        color: blue;
        margin-right: 50px;
        margin-top: 5px;
        margin-bottom: 10px;
        text-align: right;
    }

    .only-hide:hover {
        font-weight: bolder;
        cursor: pointer;
        text-decoration: underline;
    }

    .lesson:hover {
        background-color: lightgoldenrodyellow;
        cursor: pointer;
    }

    .stream:hover {
        background-color: whitesmoke;
        cursor: pointer;
    }

    .hover-bolder:hover,
    .hover-bolder-main:hover {
        font-weight: bolder;
    }

    .hover-bolder-main {
        font-size: 18px;
    }

    .show-hide {
        color: blue;
        float: right;
        margin-right: 50px;
    }

    .show-hide:hover {
        text-decoration: underline;
        font-weight: bolder;
        cursor: pointer;
    }

    .checked-label {
        margin-left: 70px;
        font-weight: bold;
    }

    .align-middle {
        vertical-align: middle;
    }

    .height-max {
        max-height: 100px;
    }

    .font-textarea {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    .sizes-min {
        padding-right: 3px;
        padding-left: 3px;
        width: 5%;
    }

    textarea {
        border: none;
        background-color: transparent;
        resize: none;
        padding-left: 0;
        padding-right: 0;
    }

    .checked {
        background-color: ghostwhite;
    }

    .checked:hover {
        background-color: lightgrey;
    }

    .curator-table {
        margin-top: 0;
        margin-bottom: 25px;
        vertical-align: middle;
    }

    /*.name-col {
        width: 12.5%;
    }

    .group-col {
        width: 10%;
    }

    .date-col {
        width: 12.5%;
    }*/

    /*.comment-col {
        width: 200px;
    }*/

    .lang-col {
        min-width: 20%;
    }

    .lang-col {
        min-width: 20%;
    }

    /*.correct-col {
        width: 5%;
    }*/

    /*.save-col {
        width: 7%;
    }*/
</style>
