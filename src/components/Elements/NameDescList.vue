<template>
    <div class="element-table">
        <div class="name-and-edit-line">
	        <h5 class="name-and-edit-label">{{ element.name }}</h5>
            <router-link
                    :to="editElementLink"
                    tag="button"
                    class="btn btn-orange btn-common name-and-edit-btn"
                    >РЕДАКТИРОВАТЬ</router-link>
            <button
                    @click="deleteElement"
                    class="btn btn-red btn-common remove-btn"
                    >X</button>
        </div>
        <div class="desc-label">
            <p>{{ element.description }}</p>
        </div>
    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';

export default {
        props: [
            'element',
            'delProps',
            'index',
        ],
        data() {
            return {
                editElementLink: {
                    path: `${ this.delProps.editPath }${ this.element.id }/`,
                    params: {
                        id: this.element.id,
                        id_last: this.$route.params.id,
                    }
                }
            }
        },
        methods: {
            deleteElement() {
                if (confirm(`Удалить ${ this.delProps.name }?`)) {
                    HTTP.delete(this.delProps.delLink + this.element.id)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Дисциплина удалена с сервера'
                            });
                            this.$emit('elementRemoved', this.index);
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            }
        }
    }
</script>

<style scoped>
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