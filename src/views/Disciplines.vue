<template>
    <div class="block-container">
        <h1 class="component-title">Список дисциплин</h1>
        <div class="component-content">
            <!-- Блок-строка дисциплины -->
            <discipline
                    v-for="discipline in disciplines"
                    :key="discipline.id"
                    :discipline="discipline"></discipline>
        </div>
        <div>
            <create-btn :createBtn="createBtn" :requestId="''"></create-btn>
        </div>
    </div>
</template>

<script>
    import Discipline from '../components/Disciplines/Discipline.vue';
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import { HTTP } from '../http-common.js';

    export default {
        data() {
            return {
                disciplines: [{
                    id: -1,
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
            }
        },
        components: {
            Discipline,
            CreateBtn
        },
        methods: {
            // Получение данных с сервера
            getData() {
      		    HTTP.get('sciences/')
                    .then(response => {
                        this.disciplines = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
                },
        },
        mounted() {
    	    this.getData();
        }
    }
</script>

<style scoped>

</style>
