<template>
    <div>
        <h1 class="component-title">Заявки на разбор или озвучку</h1>
        
        <div class="component-content">
            
            <!-- Блок выбора режима работы -->
            <div class="d-flex justify-content-start control-block">
                <div class="request-type-panel mr-4" :class="{active: (mode === 'analysis')}" @click="analysis">Заявки на разбор</div>
                <div class="request-type-panel" :class="{active: (mode === 'voice')}" @click="voice">Заявки на озвучку</div>

                <div class="ml-auto request-type-checkbox">
                    <label class="mr-3">Показать: </label>
                    <input type="checkbox" id="non-completed" class="checkbox mr-1" v-model="showNonCompleted">
                    <label for="non-completed" class="mr-3">незавершённые</label>
                    <input type="checkbox" id="completed" class="checkbox mr-1" v-model="showCompleted">
                    <label for="completed">завершённые</label>
                </div>

            </div>

            <!-- Отображение спиннера, если нет соединения с сервером -->
            <!-- При div почему-то не работает... -->
            <p class="text-center" v-if="!dataReady">
                <i class='fa fa-spinner fa-pulse fa-4x'></i>
            </p>

            <!-- Гиперблок потоков, если есть соединение с сервером -->
            <div class="table-place" v-else-if="mode != 'none'">
                
                
                <!-- The Table itself -->
                <table v-if="mode === 'analysis'" class="table table-bordered table-hover card-sentences-table">
                    
                   <!-- Заголовок таблицы -->
                    <thead>
                        <tr class="center">
                            <th class="sizes-small no-vertical-padding">Дата<br>cоздания</th>
                            <th class="sizes-small">Пользователь</th>
                            <th class="td-textarea td-lang">EN (Question)</th>
                            <th class="td-textarea td-lang">RU (Answer)</th>
                            <th class="td-textarea td-comment">Комментарий</th>
                            <th class="sizes-small" v-if="showCompleted && showPerformer">Исполнитель</th>
                        </tr>
                    </thead>

                    <!-- Тело таблицы -->
                    <tbody>

                        <!-- Непроверенные попытки -->
                        <tr 
                                v-for="(request, index) in requests" 
                                :key="index"
                                @mouseenter="activeId = request.id" 
                                @mouseleave="activeId = -1">

                            <template v-if="(showNonCompleted && request.finished === null) || (showCompleted && request.finished != null)">
                                        
                                <!-- Автор и группа попытки -->
                                <td class="center sizes-small" scope="row">{{ decodeDate(request.created) }}</td>
                                <td class="center sizes-small" scope="row">{{ request.dict_unit.profile }}</td>
                                        
                                <!-- Английский текст попытки -->
                                <td class="td-textarea td-lang">
                                    <div class="d-flex">

                                        <textarea
                                                type="text"
                                                class="form-control font-textarea"
                                                :rows="countRows(request.dict_unit.question, (189*request.dict_unit.question_audio+232*!request.dict_unit.question_audio))"
                                                placeholder="Комментарий"
                                                v-autosize="request.dict_unit.question"
                                                v-model="request.dict_unit.question"></textarea>

                                        <!-- Английская озвучка попытки, если есть -->
                                        <div 
                                                v-if="request.dict_unit.question_audio" 
                                                class="material-icons pointer ml-auto" 
                                                @click="playAudio(request.dict_unit.question_audio)">volume_up</div>

                                    </div>
                                </td>

                                <!-- Русский текст попытки -->
                                <td class="td-textarea td-lang">
                                    <div class="d-flex">

                                        <textarea
                                                type="text"
                                                class="form-control font-textarea"
                                                :rows="countRows(request.dict_unit.answer, (189*request.dict_unit.answer_audio+235*!request.dict_unit.answer_audio))"
                                                placeholder="Комментарий"
                                                v-autosize="request.dict_unit.answer"
                                                v-model="request.dict_unit.answer"></textarea>

                                        <!-- Русская озвучка попытки, если есть -->
                                        <div 
                                                v-if="request.dict_unit.answer_audio" 
                                                class="material-icons pointer ml-auto" 
                                                @click="playAudio(request.dict_unit.answer_audio)">volume_up</div>

                                    </div>
                                </td>

                                <!-- Комментарий к попытке -->
                                <td class="td-textarea td-comment">
                                    <textarea
                                            type="text"
                                            class="form-control font-textarea"
                                            :rows="countRows(request.dict_unit.comment, 181)"
                                            placeholder="Комментарий"
                                            @input="request.edited = true"
                                            v-autosize="request.dict_unit.comment"
                                            v-model="request.dict_unit.comment"></textarea>
                                </td>

                                <td v-if="showCompleted && showPerformer" class="sizes-small">
                                    {{ request.performer }}
                                </td>

                                <div 
                                        v-if="request.edited && activeId === request.id" 
                                        class="vertical-center flex-save-tr"
                                        @mouseenter="activeId = request.id" 
                                        @mouseleave="activeId = -1">
                                    <button class="btn btn-success mr-5" @click.prevent="preSave(request)">Сохранить</button>
                                </div>

                            </template>

                        </tr>

                    </tbody>

                </table>                
                
                
                <!-- The Table itself -->
                <table v-if="mode === 'voice'" class="table table-bordered table-hover card-sentences-table">
                    
                   <!-- Заголовок таблицы -->
                    <thead>
                        <tr class="center">
                            <th class="sizes-small no-vertical-padding">Дата<br>cоздания</th>
                            <th class="sizes-small">Пользователь</th>
                            <th>EN (Question)</th>
                            <th>RU (Answer)</th>
                            <th>Комментарий</th>
                            <th class="sizes-small" v-if="showCompleted && showPerformer">Исполнитель</th>
                        </tr>
                    </thead>

                    <!-- Тело таблицы -->
                    <tbody>

                        <!-- Непроверенные попытки -->
                        <tr v-for="(request, index) in requests" :key="index">
                            <template v-if="(showNonCompleted && request.finished === null) || (showCompleted && request.finished != null)">
                                        
                                <!-- Автор и группа попытки -->
                                <td class="center sizes-small" scope="row">{{ decodeDate(request.created) }}</td>
                                <td class="center sizes-small" scope="row">{{ request.dict_unit.profile }}</td>
                                        
                                <!-- Английский текст попытки -->
                                <td>
                                    <div class="d-flex">
                                        {{ request.dict_unit.question }}

                                        <!-- Английская озвучка попытки, если есть -->
                                        <div 
                                                v-if="request.dict_unit.question_audio" 
                                                class="material-icons pointer ml-auto" 
                                                @click="playAudio(request.dict_unit.question_audio)">volume_up</div>

                                    </div>
                                </td>

                                <!-- Русский текст попытки -->
                                <td>
                                    <div class="d-flex">
                                        {{ request.dict_unit.answer }}

                                        <!-- Русская озвучка попытки, если есть -->
                                        <div 
                                                v-if="request.dict_unit.answer_audio" 
                                                class="material-icons pointer ml-auto" 
                                                @click="playAudio(request.dict_unit.answer_audio)">volume_up</div>

                                    </div>
                                </td>

                                <!-- Комментарий к попытке -->
                                <td>
                                    {{ request.dict_unit.comment }}
                                </td>

                                <td v-if="showCompleted && showPerformer" class="sizes-small">
                                    {{ request.performer }}
                                </td>

                            </template>
                        </tr>

                    </tbody>

                </table> 

                <h5 v-else-if="mode === 'none'">Нет доступных заявок</h5>   

            </div>

        </div>

    </div>
</template>

<script>
    import { HTTP } from '../http-common.js'

    export default {
        data() {
            return {
                dataReady: true,
                showNonCompleted: true,
                showCompleted: false,
                mode: 'none',
                requests: [],
                showPerformer: false,
                changedRequests: [],
                activeId: -1,
                savingId: -1
            }
        },

        methods: {
            postSave(savedRequest) {
                let updatedRequests = [];
                this.requests.forEach((request) => {
                    if (request.id === this.savingId) {
                        updatedRequests.push(savedRequest);
                    } else {
                        updatedRequests.push(request);
                    }
                });
                this.savingId = -1;
                this.requests = updatedRequests;
            },

            save(request) {
                HTTP.put('/staff/curator/analysis_requests/', request)
                    .then(response => {
                        this.postSave(response.data);
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Заявка сохранена на сервере'
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

            preSave(request) {
                delete request.edited;
                this.savingId = request.id;   
                this.save(request);             
            },

            // Вычисление ширины строки
            getTextWidth(text, font) {
                let canvas = this.getTextWidth.canvas || (this.getTextWidth.canvas = document.createElement("canvas"));
                let context = canvas.getContext("2d");
                context.font = font;
                let metrics = context.measureText(text);
                return metrics.width;
            },
            
            // Расчёт количества строк текстарии
            countRows(text, width) {
                let textMeasure = this.getTextWidth(text, "400 1rem -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif");
                if (this.showCompleted && this.showPerformer) {
                    width = 0.82 * width;
                }
                let colRows = Math.ceil(textMeasure / width); // bad function
                if (colRows === 0) colRows = 1;
                return colRows;
            },


            initRequests() {
                this.showPerformer = false;
                let requestsNumber = 0;
                this.requests.forEach((request) => {
                    request.edited = false;
                    requestsNumber += 1;
                    if (request.finished != null) {
                        this.showPerformer = true;
                    }
                });
                if (requestsNumber === 0) {
                    this.mode = 'none'
                }
            },

            // Воспроизведение аудио
            playAudio(source) {
                if (this.snd) {
                    this.snd.pause();
                }
                this.snd = new Audio(source);
                this.snd.play();
            },

            decodeDate(date) {
                let msUTS = Date.parse(date);
                let normalDate = new Date(msUTS);
                let creationDate = `${normalDate.getDate()}.${normalDate.getMonth()}.${normalDate.getFullYear()}`;
                return creationDate;
            },

            analysis() {
                this.dataReady = false;
                this.mode = 'analysis';
                this.getData('/staff/curator/analysis_requests/');
            },

            voice() {
                this.dataReady = false;
                this.mode = 'voice';
                this.getData('/staff/curator/voice_requests/');
            },

            // Загрузка данных
            getData(adress) {
                HTTP.get(adress)
                    .then(response => {
                        this.requests = response.data;
                        this.initRequests();
                        this.dataReady = true;                          
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

        // Запуск получения данных при создании компонента
        created() {
            this.analysis();
        }
    }
</script>

<style scoped>
    .td-textarea {
        padding: 5px 3px;
    }

    .td-comment {
        width: 20%;
    }

    .td-lang {
        width: 25%;
    }

    .flex-save-tr {
        position: absolute;
        padding-left: 20px;
        padding-top: 5.4px;
        padding-bottom: 5.4px; 
    }

    .vertical-center {
        vertical-align: middle;
    }

    .no-borders {
        border: 1px solid white;
    }

    .invisible {
        visibility: hidden;
    }

    .no-vertical-padding {
        padding-top: 0;
        padding-bottom: 0;
    }

    .card-sentences-table {
        margin-top: 10px;
        margin-bottom: 5px;
        vertical-align: middle;
    }

    .table-place {
        margin-top: 0;
        border: 1px solid grey;
        border-top: none;
        padding: 5px;
    }

    .active {
        background-color: white;
        margin-bottom: -1px;
        margin-left: -1px;
        margin-right: -1px;
        border-right: 1px solid grey;
        border-left: 1px solid grey;
    }

    .control-block {
        border: 1px solid grey;
        border-radius: 1px;
        background-color: whitesmoke;
    }

    .checkbox {
        transform: scale(1.3);
        opacity: 0.9;
        cursor: pointer;
    }

    .request-type-panel {
        padding: 7px 65px 7px 65px;
        border-radius: 1px;
        font-size: 21px;
    }

    .request-type-panel:hover {
        cursor: pointer;
        text-decoration: underline;
        font-weight: 450;
    }

    .request-type-checkbox {
        border-radius: 3px;
        font-size: 18px;
        padding-top: 7px;
        padding: 7px 10px 7px 10px;
    }

    .sizes-small {
        padding-right: 3px;
        padding-left: 3px;
    }

    .font-textarea {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
</style>
