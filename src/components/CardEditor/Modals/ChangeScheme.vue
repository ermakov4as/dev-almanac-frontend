<template>
    <transition name="ChangeScheme">

        <!-- Всплывающее окно -->
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-standart">
                    
                    <!-- Заголовок формы -->
                    <div class="modal-header">
                        <slot name="header">
                            Заменить одинаковые схемы
                            <button class="btn btn-default btn-danger" @click.prevent="$emit('close')">
                                Отмена
                            </button>
                        </slot>
                    </div>

                    <!-- Блок отображения картинки -->
                    <div class="modal-body">
                        <slot name="body">
                            <div v-if="!changed">
                                <img :src="image.url" alt="..." class="img-thumbnail">
                            </div>
                            <div v-else>
                                <img :src="image_url" alt="..." class="img-thumbnail">
                            </div>

                        </slot>
                    </div>
                    
                    <!-- Блок выбора картинки -->
                    <div class="modal-footer">
                        <slot name="footer">
                            <label class="btn btn-default btn-file btn-primary mr-1">
                                Выберите файл <input type="file" style="display: none;"
                                                     @change="process_image($event)">
                            </label>
                            <button class="btn btn-default btn-success" @click.prevent="upload_image">
                                Загрузить
                            </button>
                        </slot>
                    </div>

                </div>
            </div>
        </div>

    </transition>
</template>

<script>
    import { HTTP_UPLOAD } from '../../../http-common.js';

    export default {
        props: ['image'],
        data() {
            return {
                image_data: {},
                image_file: "",
                image_url: "",
                changed: false
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
                    this.changed = true;
                }
            },

            // Замена изображения урока на сервере
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
                        formData.append("id", this.image.id);
                        formData.append("file", this.image_file);
                        HTTP_UPLOAD.put(`editor/upload_image/`, formData)
                            .then((response) => {
                                this.$notify({
                                    group: 'foo',
                                    type: "success",
                                    title: 'Успешно загружено',
                                    text: 'Изображение загружено на сервер'
                                });
                                this.image_url = "";
                                this.image_data = response.data;
                                this.$emit('image_changed', this.image_data);
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
                }
            }
        }
    }
</script>

