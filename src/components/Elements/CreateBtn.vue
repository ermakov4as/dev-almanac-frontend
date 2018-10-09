<template>
    <div>
        <router-link
                :to="newLessonLink"
                tag="button"
                class="btn btn-green btn-oval create-btn"
                >{{ createBtn.name }}</router-link>
    </div>
</template>

<script>
    export default {
        props: ['createBtn'],
        data() {
            let id = 0;
            return {
                newLessonLink: {
                    path: this.createBtn.btnPath,
                    params: { id }
                },
            }
        }
    }
</script>

<style scoped>
    .create-btn {
        margin-top: 20px;
    }

    .createItem {
        margin-bottom: 20px;
        margin-right: 50px;
        margin-left: auto;
    }
</style>