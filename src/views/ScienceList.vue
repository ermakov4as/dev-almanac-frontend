<template>
    <div>
        <h1 class="component-title">Список дисциплин</h1>
        <div class="component-content">

            <!-- Блок-строка дисциплины -->
            <discipline
                    v-for="(discipline, index) in disciplines"
                    :key="discipline.id"
                    :index="index"
                    :discipline="discipline"
                    @scienceRemoved="scienceRemoved"></discipline>
        </div>

        <!-- Кнопка создания новой дисциплины -->
        <div>
            <create-btn
                    :createBtn="createBtn"
                    :requestId="''"
                    @createBtnUsed="createBtnUsed"></create-btn>
        </div>

    </div>
</template>

<script>
    import Discipline from '../components/Sciences/Discipline.vue';
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import {HTTP} from '../http-common.js';

    export default {
        data() {
            return {
                disciplines: [{
                    id: 0,
                    name: "",
                    content: "",
                    desc: "",
                    video: ""
                }],
                createBtn: {
                    name: 'СОЗДАТЬ НОВУЮ',
                    btnPath: '/sciences/',
                    requestPath: 'sciences/',
                    requestId: ''
                }
            };
        },

        components: {
            Discipline,
            CreateBtn
        },

        methods: {
            // Получение данных с сервера
            getData() {
                HTTP.get('editor/sciences/')
                    .then(response => {
                        this.disciplines = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },

            // Добавление дисциплины в список дисциплин
            createBtnUsed(newLesson) {
                this.disciplines.push(newLesson)
            },

            // Удаление дисциплины. ВНИМАНИЕ!!! Отключено (закомменчено) в компоненте Discipline
            scienceRemoved(index) {
                this.disciplines.splice(index, 1)
            }
        },

        created() {
            this.getData();
        }
    }
</script>
