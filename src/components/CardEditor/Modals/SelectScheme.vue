<template>
    <transition name="UploadScheme">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-select">

                    <div class="modal-header">
                        <slot name="header">
                            Выбрать схему
                            <div class="btn btn-default btn-danger" @click="$emit('close')">
                                Отмена
                            </div>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">

                            <!--<div is="select" v-model="selectedScheme">
                                <option disabled value="">Выбор схемы</option>
                                <div is="option" v-for="(scheme, index) in schemes" :key="index">
                                    <img :src="scheme.url" alt="..." class="img-thumbnail">
                                </div>
                            </div>-->

                            <v-select :options="extendedSchemes" placeholder="Выбор схемы" label="title" v-model="selectedScheme">
                                <template slot="option" slot-scope="option">
                                    <img :src="option.url" alt="..." class="img-fluid width-max">
                                    <span>{{ option.title }}</span>
                                </template>
                            </v-select>

                            <!--<div v-if="image_url">
                                <img :src="image_url" alt="..." class="img-thumbnail">
                            </div>-->
                            <!--<div v-else-if="lesson.image">
                                <img :src="lesson.image" alt="..." class="img-thumbnail">
                            </div>-->
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <!--<button class="modal-default-button" @click="$emit('close')">
                                OK
                            </button>-->
                            <div class="btn btn-default btn-success center" @click="select_scheme">
                                Выбрать
                            </div>
                        </slot>
                    </div>

                            <!--<h5>Картинка урока:</h5>
                            <div v-if="image_url">
                                <img :src="image_url" alt="..." class="img-thumbnail">
                            </div>
                            <div v-else-if="lesson.image">
                                <img :src="lesson.image" alt="..." class="img-thumbnail">
                            </div>

                            <label class="btn btn-default btn-file btn-primary mr-1">
                                Выберите файл <input type="file" style="display: none;"
                                                     @change="process_image($event)">
                            </label>
                            <div class="btn btn-default btn-success" @click="upload_image">
                                Загрузить
                            </div>-->
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    /*import Vue from 'vue';  
    import vSelect from 'vue-select';
    Vue.component('v-select', vSelect);*/

    export default {
        props: ['schemes'],
        data() {
            return {
                extendedSchemes: [],
                selectedScheme: {}
            };
        },

        methods: {
            select_scheme() {
                delete this.selectedScheme.title;
                this.$emit('scheme_selected', this.selectedScheme);
                this.$emit('close')
            },

            prepareExnendedSchemes() {
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
            schemes: {
                handler(val, oldVal) {
                    this.prepareExnendedSchemes;
                }
            }
        },

        mounted() {
            this.prepareExnendedSchemes();
        }
    }
</script>

<style scoped>
    .width-max {
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
