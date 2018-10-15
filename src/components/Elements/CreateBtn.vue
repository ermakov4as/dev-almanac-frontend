<template>
    <div>
        <button
                @click="createNew"
                class="btn btn-green btn-oval create-btn"
                >{{ createBtn.name }}</button>
    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';

    export default {
        props: [
            'createBtn',
            'requestId'
        ],
        data() {
            return {
                newItem: {}
            }
        },
        methods: {
            createNew() {
                console.log('post::: ' + this.createBtn.requestPath);
                console.log('post::: ' + this.createBtn.btnPath);
                HTTP.post(this.createBtn.requestPath, this.requestId)
                    .then(response => {
                        this.newItem = response.data;
                        console.log(response.data);
                        this.$router.push({
                            path: this.createBtn.btnPath + this.newItem.id + '/',
                            params: { 
                                id: this.newItem.id,
                                id_last: this.$route.params.id,
                            }
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    });
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