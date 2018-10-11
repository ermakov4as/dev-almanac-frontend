<template>
    <div class="block-container">
        <h1 class="component-title">Список дисциплин</h1>
        <div class="component-content">
            <app-discipline
                    v-for="discipline in disciplines"
                    :key="discipline.id"
                    :discipline="discipline"></app-discipline>
        </div>
        <div>
            <app-create-btn :createBtn="createBtn"></app-create-btn>
        </div>
    </div>
</template>

<script>
    import Discipline from '../components/Disciplines/Discipline.vue';
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import axios from 'axios';

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
                    btnPath: '/sciences/0/edit'
                }
            }
        },
        components: {
            appDiscipline: Discipline,
            appCreateBtn: CreateBtn
        },
        methods: {
            getData() {
      		    axios
                    .get('sciences')
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
