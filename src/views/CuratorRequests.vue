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
                <table v-if="mode === 'voice'" class="table table-bordered table-hover card-sentences-table">
                    
                   <!-- Заголовок таблицы -->
                    <thead>
                        <tr class="center">
                            <th class="sizes-min no-vertical-padding">Дата<br>cоздания</th>
                            <th class="sizes-min">Пользователь</th>
                            <th class="lang-col">EN (Question)</th>
                            <th class="lang-col">RU (Answer)</th>
                            <th width="200">Комментарий</th>
                            <th class="sizes-min" v-if="showCompleted">Исполнитель</th>
                            <th class="sizes-min no-borders">
                                <div class="material-icons invisible">save</div>
                            </th>
                        </tr>
                    </thead>

                    <!-- Тело таблицы -->
                    <tbody>

                        <!-- Непроверенные попытки -->
                        <tr v-for="(request, index) in requests" :key="index">
                            <template v-if="(showNonCompleted && request.finished === null) || (showCompleted && request.finished != null)">
                                        
                                <!-- Автор и группа попытки -->
                                <td class="center sizes-min" scope="row">{{ decodeDate(request.created) }}</td>
                                <td class="center sizes-min" scope="row">{{ request.dict_unit.profile }}</td>
                                        
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

                                <td v-if="showCompleted">
                                    {{ request.performer }}
                                </td>

                                <td v-if="index === 2" class="pointer vertical-center">
                                    <div class="material-icons">
                                        save
                                    </div>
                                </td>

                            </template>
                        </tr>

                    </tbody>

                </table>        


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
                requests: []
            }
        },

        methods: {
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
            /*dataLoaded: {
                handler(val, oldVal) {
                    this.dataReady = this.dataLoaded;
                }
            }*/
        },

    }
</script>

<style scoped>
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
</style>
