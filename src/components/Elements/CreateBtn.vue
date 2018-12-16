<template>
    <div>
        <button @click.prevent="createNew" class="btn btn-green btn-oval create-btn">{{ createBtn.name }}</button>
    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js'

    export default {
        props: [
            'createBtn',
            'requestId'
        ],

        data() {
            return {
                newItem: {}
            };
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