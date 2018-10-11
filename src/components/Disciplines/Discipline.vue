<template>
    <div class="discipline">
        <div class="disc-float-left">
	        <h3>{{ discipline.name }}</h3>
        </div>
        <div class="disc-float-right">
            <router-link
                    :to="discTreeLink"
                    tag="button"
                    class="btn btn-green btn-common disc-btn"
                    >ДРЕВО</router-link>
            <router-link
                    :to="editDiscLink"
                    tag="button"
                    class="btn btn-orange btn-common disc-btn"
                    >РЕДАКТИРОВАТЬ</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                discTreeLink: {
                    path: `/sciences/${ this.discipline.id }/upload_tree/`,
                    params: { id: this.discipline.id }
                },
                editDiscLink: {
                    path: `/sciences/${ this.discipline.id }/`,
                    params: { id: this.discipline.id }
                }
            }
        },
        props: ['discipline']
    }
</script>

<style scoped>
    .discipline {
        height: 70px;
        vertical-align: middle;
        cursor: pointer;
    }

    .discipline:hover {
        background-color: whitesmoke;
    }

    .disc-float-left {
        padding: 5px 30px;
        float: left;
    }

    .disc-float-right {
        padding: 5px 30px;
        float: right;
    }

    h3 {
        height: 100%;
        vertical-align: middle;
        margin-top: 10px;
    }

    .disc-btn {
        margin-top: 12px;
        margin-left: 10px;
    }
</style>
