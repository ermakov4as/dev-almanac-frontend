<template>
    <transition v-if="kolvo > 0" name="UploadScheme">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-small">

                    <div class="modal-header">
                        <slot name="header">
                            Озвучить предложения ({{ kolvo }})
                            <div class="btn btn-default btn-danger" @click="$emit('close')">
                                Отмена
                            </div>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <!--<div>
                                <select v-model="fieldType">
                                    <option disabled value="">Выбор схемы</option>
                                    <option :value="{type: 'question'}">EN (Question)</option>
                                    <option :value="{type: 'answer'}">RU (Answer)</option>
                                </select>
                            </div>-->
                            <v-select v-model="fieldType" :options="fieldTypeOptions" placeholder="Выбор поля (EN, RU)"></v-select>
                            <br>
                            <v-select v-model="memberSelected" :options="members" label="email" placeholder="Выбор персонала"></v-select>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <p class="error-text-notification">{{ errorNotification }}</p>
                            <div class="btn btn-default btn-success center" @click="sendToBot">
                                Oтправить в бот
                            </div>
                        </slot>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import { HTTP } from '../../../http-common.js';

    export default {
        props: ['kolvo', 'examples_id'],
        data() {
            return {
                fieldType: "",
                fieldTypeOptions: [
                    {label: 'Question (EN)', value: 'question'},
                    {label: 'Answer (RU)', value: 'answer'}
                ],
                members: [],
                memberSelected: "",
                errorNotification: ""
            };
        },

        methods: {
            sendToBot() {
                if (!this.memberSelected && !this.fieldType) {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Ошибка',
                        text: 'Выберите поле и персонал'
                    });
                    this.errorNotification = "Выберите поле и персонал";
                } else if (!this.memberSelected) {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Ошибка',
                        text: 'Выберите персонал'
                    });
                    this.errorNotification = "Выберите персонал";
                } else if (!this.fieldType) {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Ошибка',
                        text: 'Выберите поле'
                    });
                    this.errorNotification = "Выберите поле";
                } else {
                    let dataToBot = {
                        user_id: this.memberSelected.id,
                        field: this.fieldType.value,
                        example_id_list: this.examples_id
                    };
                    this.errorNotification = "";
                    //console.log(dataToBot);
                    HTTP.post('editor/append_record/', dataToBot)
                        .then(response => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно отправлено',
                                text: 'Отправлено в бот'
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            this.$notify({
                                group: 'foo',
                                type: "error",
                                title: 'Произошла ошибка',
                                text: 'Ошибка отправки в бот'
                            });
                        });
                    this.$emit('close');
                };
            },

            getMembers() {
                HTTP.get('editor/member_list/')
                    .then(response => {
                        this.members = response.data;
                        //console.log(this.members);                     
                    })
                    .catch(error => {
                        console.log(error);
                        this.$notify({
                            group: 'foo',
                            type: "error",
                            title: 'Произошла ошибка',
                            text: 'Sorry'
                        });
                    });
            }
        },

        mounted() {
            if (this.kolvo <= 0) {
                this.$notify({
                    group: 'foo',
                    type: "error",
                    title: 'Озвучивание невозможно',
                    text: 'Не выбрано ни одного элемента'
                });
                this.$emit('close');
            } else {
                this.getMembers();
            }
        }
    }
</script>

<style scoped>
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
