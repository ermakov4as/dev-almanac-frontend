<template>
    <div>
        <div
                @click="createNew"
                class="btn btn-green btn-oval create-btn"
                >{{ createBtn.name }}</div>
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
            // Создаём новый элемент (урок, карточку, вершину)
            createNew() {
                HTTP.post(this.createBtn.requestPath, this.requestId)
                    .then(response => {
                        this.newItem = response.data;
                        // Возвращаем новый элемент компоненту-родителю
                        this.$emit('createBtnUsed', this.newItem);
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