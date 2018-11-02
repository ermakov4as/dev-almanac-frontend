<template>
    <div class="row mx-1">
        <div v-for="(element, index) in elements" class="col-12 mb-3">
            <div class="card d-flex flex-row">
                <div class="order-controls d-flex flex-column mx-2">
                    <div class="btn btn-vsm btn-success" @click="switch_up(index)">
                        <i class="material-icons">
                            keyboard_arrow_up
                        </i>
                    </div>
                    <div class="btn btn-vsm btn-success" @click="switch_down(index)">
                        <i class="material-icons">
                            keyboard_arrow_down
                        </i>
                    </div>
                </div>
                <div class="element-body flex-grow-1 d-flex align-items-center justify-content-center">
                    <h5>{{element.name}}</h5>
                </div>
                <div class="element-controls d-flex align-items-end p-1">
                    <router-link :to="editElementLink(element)" class="btn h100 btn-warning mr-1">Редактировать
                    </router-link>
                    <div class="btn btn-danger" @click="deleteElement(index)">Удалить</div>
                </div>
            </div>
            <div class="card card-description" v-if="element.description">
                <div class="description" v-html="element.description"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import {HTTP} from "../../http-common";

    export default {
        name: "items-list-editor",
        props: ['value', 'props'],
        data() {
            return {
                elements: [],
            }
        },
        methods: {
            editElementLink(element) {
                return {
                    path: `${ this.props.editPath }${ element.id }/`,
                    params: {
                        id: element.id,
                        id_last: this.$route.params.id,
                    }
                }
            },
            deleteElement(index) {
                if (confirm(`Удалить ${ this.props.name }?`)) {
                    HTTP.delete(this.props.delLink + this.elements[index].id)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Удалено с сервера'
                            });
                            // Возврат родителю информации о том, какой (по порядку) элемент был удалён
                            this.elements.splice(index, 1);
                            this.$emit('input', this.elements);
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            },
            switch_up(index) {
                if (index !== 0)
                    this.elements.splice(index - 1, 2, this.elements[index], this.elements[index - 1]);
                this.$emit('input', this.elements);
            },
            switch_down(index) {
                if (index !== this.elements.length - 1)
                    this.elements.splice(index, 2, this.elements[index + 1], this.elements[index]);
                this.$emit('input', this.elements);
            }

        },
        created() {
            this.elements = this.value;
        },
        watch: {
            value(from, to) {
                this.elements = this.value;
            }
        }
    }
</script>

<style scoped>
    /*.card {*/
    /*padding: 5px;*/
    /*}*/
    .material-icons {
        font-size: 21px;
        line-height: 21px;
        display: block;
    }

    .btn-warning {
        color: white;
    }

    .btn-vsm {
        padding: 0;
    }

    .card-description {
        border-top: 0;
    }

    .description >>> p {
        margin-bottom: 0;
    }
</style>