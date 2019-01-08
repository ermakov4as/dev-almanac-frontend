<template>
    <div>
        <h1 class="component-title">Заявки на разбор или озвучку</h1>
        
        <div class="component-content">
            
            <!-- Блок выбора режима работы -->
            <div>
                <!--<div class="label-subtitle">
                    <label for="name">Выбор типа заявки</label>
                </div>-->
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
                            <!--th class="sizes-min no-borders">
                                <div class="material-icons invisible">save</div>
                            </th-->
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
                                <!--@mouseenter="request.focused = true" 
                                @mouseleave="request.focused = false"-->

                            <!--analysis-line
                                    v-if="(showNonCompleted && request.finished === null) || (showCompleted && request.finished != null)"
                                    :request="request"
                                    :performerEnable="showCompleted && showPerformer"
                                    @scheme_selected="schemeSelected"></analysis-line-->

                            <template v-if="(showNonCompleted && request.finished === null) || (showCompleted && request.finished != null)">
                                        
                                <!-- Автор и группа попытки -->
                                <td class="center sizes-small" scope="row">{{ decodeDate(request.created) }}</td>
                                <td class="center sizes-small" scope="row">{{ request.dict_unit.profile }}</td>
                                        
                                <!-- Английский текст попытки -->
                                <td class="td-textarea td-lang">
                                    <div class="d-flex">
                                        <!--{{ request.dict_unit.question }}-->

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
                                        <!--{{ request.dict_unit.answer }}-->

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

                                    <!--{{ request.dict_unit.comment }}-->
                                </td>

                                <!-- Кнопка сохранения попытки -->
                                <!--<td class="sizes-min align-middle">
                                    <div class="btn btn-success" @click="saveAttempt(request)">Сохранить</div>
                                </td>-->

                                <td v-if="showCompleted && showPerformer" class="sizes-small">
                                    {{ request.performer }}
                                </td>

                                <!--td v-if="index === 2" class="pointer vertical-center">
                                    <div class="material-icons">
                                        save
                                    </div>
                                </td-->

                                <div 
                                        v-if="request.edited && activeId === request.id" 
                                        class="vertical-center flex-save-tr"
                                        @mouseenter="activeId = request.id" 
                                        @mouseleave="activeId = -1">
                                    <button class="btn btn-success mr-5" @click.prevent="preSave(request)">Сохранить</button>
                                </div>

                            </template>

                            <!--td v-if="index === 1" class="pointer vertical-center flex-save-tr">
                                <div class="material-icons">
                                    save
                                </div>
                            </td-->

                        </tr>

                    </tbody>

                </table>                
                

                <!--///////////////////////////////////////////////////-->
                
                <!-- The Table itself -->
                <table v-if="mode === 'voice'" class="table table-bordered table-hover card-sentences-table">
                    
                   <!-- Заголовок таблицы -->
                    <thead>
                        <tr class="center">
                            <th class="sizes-small no-vertical-padding">Дата<br>cоздания</th>
                            <th class="sizes-small">Пользователь</th>
                            <th class="lang-col">EN (Question)</th>
                            <th class="lang-col">RU (Answer)</th>
                            <th class="lang-col">Комментарий</th>
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
                                <td class="lang-col">
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
                                <td class="lang-col">
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
                                    <!--<textarea
                                            type="text"
                                            id='comment'
                                            class="form-control font-textarea"
                                            :rows="countRows(request.dict_unit.comment)"
                                            placeholder="Комментарий"
                                            v-autosize="request.dict_unit.comment"
                                            v-model="request.dict_unit.comment"></textarea>-->
                                    {{ request.dict_unit.comment }}
                                </td>

                                <!-- Кнопка сохранения попытки -->
                                <!--<td class="sizes-min align-middle">
                                    <div class="btn btn-success" @click="saveAttempt(request)">Сохранить</div>
                                </td>-->

                                <td v-if="showCompleted && showPerformer" class="sizes-small">
                                    {{ request.performer }}
                                </td>

                            </template>
                        </tr>

                    </tbody>

                </table> 

                <h5 v-else-if="mode === 'none'">Нет доступных заявок</h5>   

                <!--<div v-if="mode === 'analysis'">
                    <p>!!!</p>
                </div>

                <div v-else-if="mode === 'voice'">

                </div>-->

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
                //requestsOld: [],
                //requests_id: [],
                showPerformer: false,
                changedRequests: [],
                activeId: -1,
                requestsNumber: 0,
                savingId: -1/*,
                members: [],
                membersReady: false*/
            }
        },

        methods: {
            postSave(savedRequest) {
                //let requests = this.requests;
                let updatedRequests = [];
                this.requests.forEach((request) => {
                    if (request.id === this.savingId) {
                        updatedRequests.push(savedRequest);
                        console.log('---');
                        console.log(request);
                        console.log(savedRequest);
                        console.log('+++');
                        /*request = savedRequest;
                        console.log(request);
                        console.log('!!!');*/
                    } else {
                        updatedRequests.push(request);
                    }
                });
                console.log(updatedRequests);
                this.savingId = -1;
                this.requests = updatedRequests;
                //return requests;
            },

            save(request) {
                HTTP.put('/staff/curator/analysis_requests/', request)
                    .then(response => {
                        console.log('resp.');
                        console.log(response.data);
                        //this.requests = this.postSave(response.data);
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
                //console.log(request);
                delete request.edited;
                this.savingId = request.id;
                //delete request.focused;
                //this.$delete(request, 'focused');
                console.log('ttt');
                console.log(request);   
                this.save(request);             
            },

            /*test(id) {
                console.log('test' + id);
            },*/

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

            /*// Запись id активного quill-редактора
            setActiveId(id, type) {
                this.activeId = id;
                this.activeType = type;
            },

            // Закрытие всех quill-редакторов
            removeActiveId() {
                this.activeId = -1;
                this.activeType == "";
            },*/

            /*// Загрузка списка персонала
            getMembers() {
                HTTP.get('editor/member_list/')
                    .then(response => {
                        this.members = response.data; 
                        this.membersReady = true;
                        console.log(this.members);                    
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
            },*/

            initRequests() {
                this.requests.forEach((request) => {
                    request.edited = false;
                    this.requestsNumber += 1;
                    //this.$set(request, 'focused', false);
                    //request.focused = false;
                    if (request.finished != null) {
                        this.showPerformer = true;
                    }
                    //this.requests_id.push(request.id);
                    //this.dataReady = true;
                });
                if (this.requestsNumber === 0) {
                    this.mode = 'none'
                }
                /*if (this.showPerformer) {
                    this.getMembers()
                }*/
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
                //console.log(creationDate);
                return creationDate;
            },

            analysis() {
                //this.dataLoaded = false;
                //this.$set(this.flags, 'dataReady', false);
                this.dataReady = false;
                this.mode = 'analysis';
                this.getData('/staff/curator/analysis_requests/');
                //this.dataReady = true;
            },

            voice() {
                this.dataReady = false;
                this.mode = 'voice';
                this.getData('/staff/curator/voice_requests/');
                //this.dataReady = true;
            },

            // Загрузка данных
            getData(adress) {
                HTTP.get(adress)
                    .then(response => {
                        console.log(response.data);
                        this.requests = response.data;
                        //this.requestsOld = response.data;
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

        watch: {
            /*requests: {
                handler(val, oldVal) {
                    if (this.dataReady) {*/
                        /*console.log(this.requestsOld[0].dict_unit.comment);
                        console.log(this.requests[0].dict_unit.comment);
                        this.requests.forEach((request) => {
                            let requestOld = this.requestsOld.find(x => x.id === request.id);
                            if (request.dict_unit.comment != requestOld.dict_unit.comment) {
                                console.log(request.id);
                            }
                        });*/
                        /*console.log(val);
                        console.log(oldVal);
                        if (val === oldVal) {
                            console.log('===')
                        } else console.log('!=')
                    }
                },
                deep: true
            }*/
            /*dataLoaded: {
                handler(val, oldVal) {
                    this.dataReady = this.dataLoaded;
                }
            }*/
        },

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

    /*.no-right-border {
        border-right: 0px;
    }*/

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

    .sizes-min {
        padding-right: 0px;
        padding-left: 0px;
    }
</style>
