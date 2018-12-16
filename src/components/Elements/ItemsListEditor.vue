<template>
    <transition-group name="flip-list" class="row mx-1">

        <!-- Блок элемента (урока, карточки) -->
        <div v-for="(element, index) in elements" class="col-12 mb-3" :key="element.id">
            
            <!-- Верхняя строка -->
            <div class="card d-flex flex-row">

                <!-- Блок стрелок перемещения вверх/вниз в списке -->
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

                <!-- Название элемента -->
                <div class="element-body flex-grow-1 d-flex align-items-center justify-content-center">
                    <h5>{{element.name}}</h5>
                </div>

                <!-- Блок кнопок редактирования и удаления элемента -->
                <div class="element-controls d-flex align-items-end p-1">
                    <router-link :to="editElementLink(element)" class="btn h100 btn-warning mr-1">Редактировать
                    </router-link>
                    <button class="btn btn-danger" @click.prevent="deleteElement(index, element.name)">Удалить</button>
                </div>
                
            </div>

            <!-- Нижняя строка, описание элемента -->
            <div class="card card-description" v-if="element.description">
                <div class="description" v-html="element.description"></div>
            </div>

        </div>

    </transition-group>
</template>

<script>
    import {HTTP} from "../../http-common"

    export default {
        name: "items-list-editor",
        props: ['value', 'props'],

        data() {
            return {
                elements: [],
            }
        },

        methods: {
            // Путь к странице редактирования
            editElementLink(element) {
                return {
                    path: `${ this.props.editPath }${ element.id }/`,
                    params: {
                        id: element.id,
                        id_last: this.$route.params.id,
                    }
                };
            },

            // Удаление элемента (урока, карточки) из списка
            deleteElement(index, name) {
                if (confirm(`Удалить ${ this.props.name } "${ name }"?`)) {
                    HTTP.delete(this.props.delLink + this.elements[index].id)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Удалено с сервера'
                            });
                            this.elements.splice(index, 1);

                            // Возврат родителю информации о том, какой (по порядку) элемент был удалён
                            this.$emit('input', this.elements);

                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            },

            // Перемещение элемента (урока, карточки) вверх в списке
            switch_up(index) {
                if (index !== 0)
                    this.elements.splice(index - 1, 2, this.elements[index], this.elements[index - 1])

                // Возврат родителю информации об изменённом списке элементов
                this.$emit('input', this.elements);

            },

            // Перемещение элемента (урока, карточки) вниз в списке
            switch_down(index) {
                if (index !== this.elements.length - 1)
                    this.elements.splice(index, 2, this.elements[index + 1], this.elements[index])

                // Возврат родителю информации об изменённом списке элементов
                this.$emit('input', this.elements);

            }
        },

        created() {
            this.elements = this.value;
        },

        watch: {
            // Отслеживание изменения данных в родительском компоненте
            value(from, to) {
                this.elements = this.value;
            }
        }
    }
</script>

<style scoped>
    .flip-list-move {
        transition: transform 0.5s;
    }

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