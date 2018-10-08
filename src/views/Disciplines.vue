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
            <app-create-disc></app-create-disc>
        </div>
    </div>
</template>

<script>
    import Discipline from '../components/Disciplines/Discipline.vue';
    import CreateDisc from '../components/Disciplines/CreateDisc.vue';
    import axios from 'axios';

    const apiURL = 'http://127.0.0.1:8081/';

    export default {
        data() {
            return {
                disciplines: [{
                    id: 0,
                    name: "Name",
                    content: "Content",
                    desc: "Description",
                    video: "Video"
                }]
            }
        },
        components: {
            appDiscipline: Discipline,
            appCreateDisc: CreateDisc
        },
        methods: {
            getData() {
      		axios
				.get(`${apiURL}sciences`)
				.then(response => {
					this.disciplines = response.data;
					console.log(response);
					console.log(this.disciplines)
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
