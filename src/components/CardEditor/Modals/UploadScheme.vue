<template>
    <transition name="UploadScheme">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-standart">

                    <div class="modal-header">
                        <slot name="header">
                            Загрузить схему для {{ titleText }}
                            <div class="btn btn-default btn-danger" @click="$emit('close')">
                                Отмена
                            </div>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <div v-if="image_url">
                                <img :src="image_url" alt="..." class="img-thumbnail">
                            </div>
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
                            <label class="btn btn-default btn-file btn-primary mr-1">
                                Выберите файл <input type="file" style="display: none;"
                                                     @change="process_image($event)">
                            </label>
                            <div class="btn btn-default btn-success" @click="upload_image">
                                Загрузить
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
    import { HTTP_UPLOAD } from '../../../http-common.js';

    export default {
        props: ['kolvo'],
        data() {
            return {
                image_data: {},
                image_file: "",
                image_url: "",
                titleText: "предложений"
            };
        },

        methods: {
            // Подготовка к загрузке изображения урока
            process_image(event) {
                if (event.target.files[0]) {
                    let reader = new FileReader();
                    let app = this;
                    reader.onload = function (e) {
                        app.image_url = e.target.result;
                    };
                    app.image_file = event.target.files[0];
                    reader.readAsDataURL(event.target.files[0]);
                };
            },

            // Загрузка изображения урока на сервер
            upload_image() {
                if (this.image_file) {
                    if (this.image_file.size < 3000000) {
                        this.$notify({
                            group: 'foo',
                            type: "warn",
                            title: 'Пожалуйста, подождите',
                            text: 'Загрузка файла на сервер'
                        });
                        let formData = new FormData();
                        formData.append("file", this.image_file);
                        HTTP_UPLOAD.post(`editor/upload_image/`, formData)
                            .then((response) => {
                                this.$notify({
                                    group: 'foo',
                                    type: "success",
                                    title: 'Успешно загружено',
                                    text: 'Изображение загружено на сервер'
                                });
                                this.image_url = "";
                                this.image_data = response.data;
                                this.$emit('image_uploaded', this.image_data);
                                //console.log(this.image_data);
                                this.$emit('close');
                            })
                            .catch((error) => {
                                console.log(error);
                                this.$notify({
                                    group: 'foo',
                                    type: "error",
                                    title: 'Произошла ошибка',
                                    text: 'Sorry'
                                });
                            });
                    } else {
                        this.$notify({
                            group: 'foo',
                            type: "warn",
                            title: 'Слишком большой файл',
                            text: 'Уменьшите изображение'
                        });
                    }
                };
            }
        },

        mounted() {
            if (this.kolvo > 0) {
                if (this.kolvo > 1) {
                    this.titleText = this.kolvo + ' предложений';
                } else if (this.kolvo === 1) {
                    this.titleText = this.kolvo + ' предложения';
                };
            };
        }
    }
</script>

