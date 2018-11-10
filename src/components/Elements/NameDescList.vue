<template>
    <div class="element-table">

        <!-- Верхняя строка блока -->
        <div class="name-and-edit-line">

            <!-- Название элемента -->
	        <h5 class="name-and-edit-label">{{ element.name }}</h5>

            <!-- Кнопка редактирования элемента (переход на страницу редактирования) -->
            <router-link
                    :to="editElementLink"
                    tag="button"
                    class="btn btn-orange btn-common name-and-edit-btn"
                    >РЕДАКТИРОВАТЬ</router-link>

            <!-- Кнопка удаления элемента -->
            <div @click="deleteElement" class="btn btn-red btn-common remove-btn">X</div>
        </div>

        <!-- Нижняя строка блока, описание элемента -->
        <div class="desc-label" id="article">
            <p v-html="element.description"></p>
        </div>

    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';

    export default {
        props: [
            'element',
            'delProps',
            'index'
        ],

        data() {
            return {
                editElementLink: {
                    path: `${ this.delProps.editPath }${ this.element.id }/`,
                    params: {
                        id: this.element.id,
                        id_last: this.$route.params.id,
                    }
                },
                blocks: []
            }
        },

        methods: {
            // Запрос на удаление элемента
            deleteElement() {
                if (confirm(`Удалить ${ this.delProps.name }?`)) {
                    HTTP.delete(this.delProps.delLink + this.element.id)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Удалено с сервера'
                            });

                            // Возврат родителю информации о том, какой (по порядку) элемент был удалён
                            this.$emit('elementRemoved', this.index);

                        })
                        .catch((error) => {
                            console.log(error)
                        })
                };
            }
        }
    }
</script>

<style scoped>
    #article >>> p {
        margin-bottom: 0;
    }

    p {
        margin: 0;
    }

    .element-table {
        margin: 0 30px -1px 30px;
    }

    .desc-label {
        border: 1px solid gray;
        margin-top: -1px;
        vertical-align: middle;
        font-size: 14px;
        text-align: start;
        padding-left: 10px;
        padding-right: 10px;
        min-height: 30px;
    }

    .name-and-edit-line {
        text-align: center;
        border: 1px solid gray;
        padding: 0;
    }

    .name-and-edit-line:before {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .name-and-edit-btn {
        display: inline-block;
        width: 20%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .remove-btn {
        display: inline-block;
        width: 5%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .name-and-edit-label {
        display: inline-block;
        width: 75%;
        vertical-align: middle;
        margin: 0;
    }
</style>