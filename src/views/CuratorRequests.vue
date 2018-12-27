<template>
    <div>
        <h1 class="component-title">Заявки на разбор или озвучку</h1>
        
        <!-- Отображение спиннера, если нет соединения с сервером -->
        <!-- При div почему-то не работает... -->
        <p class="text-center" v-if="!dataReady">
            <i class='fa fa-spinner fa-pulse fa-4x'></i>
        </p>
        
        <!-- Гиперблок потоков, если есть соединение с сервером -->
        <div class="component-content" v-else>
            
            <!-- Блок выбора режима работы -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="name">Выбор типа заявки</label>
                    </div>
                    <div class="d-flex justify-content-start">
                        <div class="request-type-panel mr-4">Заявки на разбор</div>
                        <div class="request-type-panel">Заявки на озвучку</div>

                        <div class="ml-auto request-type-checkbox">
                            <label class="mr-3">Показать: </label>
                            <input type="checkbox" id="non-completed" v-model="showNonCompleted">
                            <label for="non-completed" class="mr-3">незавершённые</label>
                            <input type="checkbox" id="completed" v-model="showCompleted">
                            <label for="completed">завершённые</label>
                        </div>

                    </div>
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
                showCompleted: false
            }
        },

        methods: {
            // Загрузка данных
            getData() {
                HTTP.get('/staff/curator/attempt_list/')
                    .then(response => {
                        this.streams = response.data;
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

        },

    }
</script>

<style scoped>
    .request-type-panel {
        padding: 7px 65px 7px 65px;
        background-color: blue;
        border-radius: 3px;
        font-size: 21px;
    }

    .request-type-panel:hover {
        cursor: pointer;
        text-decoration: underline;
        font-weight: 450;
    }

    .request-type-checkbox {
        background-color: green;
        border-radius: 3px;
        font-size: 18px;
        padding-top: 7px;
        padding: 7px 10px 7px 10px;
    }
</style>
