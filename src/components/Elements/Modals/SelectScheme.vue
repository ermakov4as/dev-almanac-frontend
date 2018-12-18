<template>
    <transition name="UploadScheme">

        <!-- Всплывающее окно -->
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-select">

                    <!-- Заголовок формы -->
                    <div class="modal-header">
                        <slot name="header">
                            Выбрать схему
                            <button class="btn btn-default btn-danger" @click.prevent="$emit('close')">
                                Отмена
                            </button>
                        </slot>
                    </div>

                    <!-- Выбор изображений из списка загруженных недавно и уже находящихся в таблице -->
                    <div class="modal-body">
                        <slot name="body">
                            <v-select :options="extendedSchemes" placeholder="Выбор схемы" label="title" v-model="selectedScheme">
                                <template slot="option" slot-scope="option">
                                    <img :src="option.url" alt="..." class="img-fluid size-max">
                                    <span>{{ option.title }}</span>
                                </template>
                            </v-select>
                        </slot>
                    </div>

                    <!-- Блок выбора изображения -->
                    <div class="modal-footer">
                        <slot name="footer">
                            <button class="btn btn-default btn-success center" @click.prevent="select_scheme">
                                Выбрать
                            </button>
                        </slot>
                    </div>

                </div>
            </div>
        </div>

    </transition>
</template>

<script>
    export default {
        props: ['schemes'],
        data() {
            return {
                extendedSchemes: [],
                selectedScheme: {}
            };
        },

        methods: {
            // Выбор изображения и возврат в родительский компонент
            select_scheme() {
                delete this.selectedScheme.title;
                this.$emit('scheme_selected', this.selectedScheme);
                this.$emit('close')
            },

            // Подготовка данных для работы списка выбора изображений
            prepareExnendedSchemes() {
                this.extendedSchemes = [];
                let schemeIndex = 1;
                this.schemes.forEach((scheme) => {
                    let title = `Изображение №${schemeIndex}`;
                    schemeIndex += 1;
                    let tmpScheme = {
                        title,
                        id: scheme.id,
                        url: scheme.url
                    };
                    this.extendedSchemes.push(tmpScheme);
                });
            }
        },

         watch: {
            // Инициализация компонента в случае подкгрузки изображений из карточек
            schemes: {
                handler(val, oldVal) {
                    this.prepareExnendedSchemes();
                }
            }
        },

        // Инициализация компонента
        mounted() {
            this.prepareExnendedSchemes();
        }
    }
</script>

<style scoped>
    .size-max {
        max-height: 110px;
        max-width: 75%;
        margin-right: 15px;
    }

    body {
        font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    }

    #app {
        max-width: 30em;
        margin: 1em auto;
    }

    #app .dropdown li {
        border-bottom: 1px solid rgba(112, 128, 144, 0.1)
    }

    #app .dropdown li:last-child {
        border-bottom: none;
    }

    #app .dropdown li a {
        padding: 10px 20px;
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 1.25em;
    }

    #app .dropdown li a .fa {
        padding-right: 0.5em;
    }
</style>
