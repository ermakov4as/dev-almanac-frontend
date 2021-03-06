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

            <!-- Потоки -->
            <div v-for="(stream, streamIndex) in streams" :key="streamIndex">     
                <div class="form-group elements-list-margin" @click="stream.showStream = !stream.showStream">
                    <div class="label-subtitle stream">
                        <h3>Поток: {{ stream.name }} ({{ stream.unchecked }})
                        </h3>
                    </div>
                </div>

                <!-- Уроки -->
                <div v-if="stream.showStream" v-for="(lesson, lessonIndex) in stream.lessons" :key="lessonIndex">
                    <div class="form-group elements-list-margin" @click="lesson.showLesson = !lesson.showLesson">
                        <div class="label-subtitle lesson">
                            <h5>Урок: {{ lesson.name }} ({{ lesson.unchecked }})
                            </h5>
                        </div>
                    </div>

                    <!-- Схемы -->
                    <div v-if="lesson.showLesson" v-for="(image, imageIndex) in lesson.images" :key="imageIndex">
                        <div v-if="lesson.images != ''" class="d-flex justify-content-center">
                            <img :src="image.image_url" alt="..." class="img-fluid height-max">
                        </div>
                        
                        <!-- Таблица к схеме -->
                        <table class="table table-bordered table-hover curator-table">
                            
                            <!-- Заголовок таблицы -->
                            <thead>
                                <tr class="center">
                                    <th class="sizes-min no-vertical-padding">Имя студента<br>Время попытки</th>
                                    <th class="sizes-min">Группа</th>
                                    <th class="lang-col">EN</th>
                                    <th class="lang-col">RU</th>
                                    <th class="sizes-min">Баллы</th>
                                    <th width="200">Комментарий</th>
                                    <th class="sizes-min"></th>
                                </tr>
                            </thead>
                            
                            <!-- Тело таблицы -->
                            <tbody>

                                <!-- Непроверенные попытки -->
                                <tr v-for="(attempt, attemptIndex) in image.attempts" :key="attemptIndex">
                                    <template v-if="!attempt.checked">
                                        
                                        <!-- Автор и группа попытки -->
                                        <td class="center sizes-min no-vertical-padding" scope="row">
                                            {{ attempt.name }}<br>{{ decodeDateTime(attempt.date_created) }}
                                        </td>
                                        <td class="center sizes-min" scope="row">{{ attempt.team }}</td>
                                        
                                        <!-- Английский текст попытки -->
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.question }}

                                                <!-- Английская озвучка попытки, если есть -->
                                                <div 
                                                        v-if="attempt.question_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.question_audio)">volume_up</div>

                                            </div>
                                        </td>

                                        <!-- Русский текст попытки -->
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.answer }}

                                                <!-- Русская озвучка попытки, если есть -->
                                                <div 
                                                        v-if="attempt.answer_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.answer_audio)">volume_up</div>

                                            </div>
                                        </td>

                                        <!-- Правильность попытки -->
                                        <!--td class="sizes-min center" @click="attempt.accepted = !attempt.accepted"-->
                                        <td class="sizes-min center">
                                            <input
                                                    type="text"
                                                    id="name"
                                                    class="form-control"
                                                    v-model="attempt.result">
                                            <!--<i class="material-icons pointer" v-if="!attempt.accepted">clear</i>
                                            <i class="material-icons pointer" v-else>done</i>-->
                                        </td>

                                        <!-- Комментарий к попытке -->
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

                                        <!-- Кнопка сохранения попытки -->
                                        <td class="sizes-min align-middle">
                                            <div class="btn btn-success" @click="saveAttempt(attempt, lesson, stream)">Сохранить</div>
                                        </td>

                                    </template>
                                </tr>

                                <!-- Блок показа/скрытия проверенных попыток -->
                                <tr>
                                    <td colspan="7" @click="image.showChecked = !image.showChecked">
                                        <span class="checked-label">Проверенные: </span>
                                        <span class="show-hide">{{ image.showChecked ? 'Скрыть' : 'Показать' }}</span>
                                    </td>
                                </tr>

                                <!-- Проверенные попытки -->
                                <tr v-if="image.showChecked" v-for="(attempt, attemptIndex) in image.attempts" :key="(attemptIndex*(-1))-1" class="checked">
                                    <template v-if="attempt.checked">
                                        
                                        <!-- Автор и группа попытки -->
                                        <td class="center sizes-min no-vertical-padding" scope="row">
                                            {{ attempt.name }}<br>{{ decodeDateTime(attempt.date_created) }}
                                        </td>
                                        <td class="center sizes-min" scope="row">{{ attempt.team }}</td>
                                        
                                        <!-- Английский текст попытки -->
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.question }}

                                                <!-- Английская озвучка попытки, если есть -->
                                                <div 
                                                        v-if="attempt.question_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.question_audio)">volume_up</div>

                                            </div>
                                        </td>

                                        <!-- Русский текст попытки -->
                                        <td class="lang-col">
                                            <div class="d-flex">
                                                {{ attempt.answer }}

                                                <!-- Русская озвучка попытки, если есть -->
                                                <div 
                                                        v-if="attempt.answer_audio" 
                                                        class="material-icons pointer ml-auto" 
                                                        @click="playAudio(attempt.answer_audio)">volume_up</div>

                                            </div>
                                        </td>

                                        <!-- Правильность попытки -->
                                        <!--td class="sizes-min center" @click="attempt.accepted = !attempt.accepted">
                                            <i class="material-icons pointer" v-if="!attempt.accepted">clear</i>
                                            <i class="material-icons pointer" v-else>done</i>
                                        </td-->
                                        <td class="sizes-min center">
                                            <input
                                                    type="text"
                                                    id="name"
                                                    class="form-control"
                                                    v-model="attempt.result">
                                        </td>

                                        <!-- Комментарий к попытке -->
                                        <td class="td-textarea">
                                            <textarea
                                                    type="text"
                                                    id='comment'
                                                    class="form-control font-textarea"
                                                    :rows="countRows(attempt.comment)"
                                                    placeholder="Комментарий"
                                                    v-autosize="attempt.comment"
                                                    v-model="attempt.comment"></textarea>
                                        </td>

                                        <!-- Кнопка сохранения попытки -->
                                        <td class="sizes-min align-middle">
                                            <button class="btn btn-success" @click.prevent="saveAttempt(attempt, lesson, stream)">Сохранить</button>
                                        </td>
                                
                                    </template>
                                </tr>


                            </tbody>

                        </table>

                    </div>

                    <!-- Дополнительный блок сворачивания урока -->
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
    import { HTTP } from '../http-common.js'
    //import { test } from '../components/Elements/CommonFunstions/Requests.js'
    //import { notif } from '../components/Elements/CommonFunstions/Notifications.js'

    export default {
        data() {
            return {
                dataReady: false,
                streams: {},
                dataLoaded: false
            }
        },

        methods: {
            // Преобразование времени в читаемый вид
            decodeDateTime(date) {
                let msUTS = Date.parse(date);
                let _Date = new Date(msUTS);
                let minutes = _Date.getMinutes();
                let extraZeros = '';
                if (minutes < 10) {
                    if (minutes === 0) {
                        extraZeros = '00';
                    } else {
                        extraZeros = '0';
                    }
                }
                let creationDate = `${_Date.getDate()}.${_Date.getMonth()}.${_Date.getFullYear()}, ${_Date.getHours()}:${extraZeros}${minutes}`;
                return creationDate;
            },

            // Сохранение попытки
            saveAttempt(attempt, lesson, stream) {
                let savingAttempt ={
                    id: attempt.id,
                    result: attempt.result,
                    comment: attempt.comment
                };
                if (attempt.comment === "") {
                    savingAttempt.comment = null;
                }
                HTTP.put('/staff/curator/сheck_attempt/', savingAttempt)
                    .then(response => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Данные отправлены на сервер'
                        });
                        attempt.checked = true;
                        lesson.unchecked -= 1;
                        stream.unchecked -= 1;
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

            // Выполняется при инициализации: добавляем свойства показано/скрыто
            initStreams() {
                this.streams.forEach((stream) => {
                    this.$set(stream, 'showStream', false);
                    this.$set(stream, 'unchecked', 0);
                    stream.lessons.forEach((lesson) => {
                        this.$set(lesson, 'showLesson', false);
                        this.$set(lesson, 'unchecked', 0);
                        lesson.images.forEach((image) => {
                            this.$set(image, 'showChecked', false);
                            image.attempts.forEach((attempt) => {
                                if (!attempt.checked) {
                                    lesson.unchecked += 1;
                                }
                            });
                        });
                        stream.unchecked += lesson.unchecked;
                    });
                });
            },

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
                let colRows = Math.ceil(textMeasure / 165); //175.20 //145
                if (colRows === 0) colRows = 1
                return colRows;
            },
            
            // Воспроизведение аудио
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            },

            // Загрузка данных
            getData() {
                HTTP.get('/staff/curator/attempt_list/')
                    .then(response => {
                        this.streams = response.data;
                        console.log(this.streams);
                        this.dataLoaded = true;
                        //notif('success', "");                           
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
            // Отслеживание загрузки данных для запуска инициализации 
            //(т.к. сама инициализация - длительный процесс, при запуске из приёма данных даёт ошибку по времени)
            dataLoaded: {
                handler(val, oldVal) {
                    if (this.dataLoaded) {
                        this.initStreams();
                        this.dataReady = true;
                        
                        /*let aaa = test();
                        console.log(aaa);*/
                        
                        /*var promise = new Promise((resolve, reject) => {
                            let a = test();
                            setTimeout(() => {
                                resolve(a);
                            }, 5000);
                        });

                        promise
                            .then(
                                result => alert("Fulfilled: " + result),
                                error => alert("Rejected: " + error)
                        );*/

                    }
                }
            }
        },

        // Запуск получения данных при создании компонента
        created() {
            this.getData();
        }
    }
</script>

<style scoped>
    .no-vertical-padding {
        padding-top: 0;
        padding-bottom: 0;
    }

    .td-textarea {
        padding: 3px;
    }

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

    .lang-col {
        min-width: 20%;
    }

    .lang-col {
        min-width: 20%;
    }
</style>
