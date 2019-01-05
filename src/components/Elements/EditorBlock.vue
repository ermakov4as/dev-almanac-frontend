<template>
    <div class="container editor-border ">
        <div id="article">
            <div class="row">
                <div class="col-12">
                    <div v-for="(block, index) in blocks" :key="index">

                        <!--Если включен редактор-->
                        <div class="content-block" v-if="index===show">
                            <div v-if="block.type===contentType.IMAGE">
                                <img v-if="block.content" class="img-fluid image-standart" :src="block.content"
                                     style="cursor: pointer;"
                                     data-toggle="modal"
                                     data-target="#imageModal" @click="edit_index=index" alt="...">
                                <img v-else class="img-fluid"
                                     :src="DEFAULT_IMAGE_URL"
                                     style="cursor: pointer;"
                                     data-toggle="modal"
                                     data-target="#imageModal" @click="edit_index=index" alt="...">
                            </div>
                            <div v-else-if="block.type===contentType.YOUTUBE">
                                <input class="form-control" v-model="block.content">
                            </div>
                            <div v-else-if="block.type===contentType.EXAMPLE && examples!='none'">
                                <div 
                                        v-if="block.content && block.content!='Default Content' && block.content!='<p>Default Content</p>'" 
                                        class="d-flex justify-content-center color-example">
                                    <div class="example-label">Пример:</div>
                                    <figure class="ml-auto no-margin-bottom">
                                        <img :src="block.content.url" alt="..." class="img-fluid height-max image-standart">
                                    </figure>
                                    <div class="material-icons pointer ml-auto" @click="block.content = ''">close</div>
                                </div>
                                <div v-else class="center">
                                    <button 
                                            class="btn btn-outline-secondary" 
                                            @click.prevent="{selectScheme = true; selectIndex = index}">Выберите схему</button>
                                    <select-scheme 
                                            v-if="selectScheme"
                                            :schemes="examples"
                                            @close="selectScheme = false"
                                            @scheme_selected="schemeSelected"></select-scheme>
                                </div>
                            </div>
                            <div v-else-if="block.type===contentType.LABELED_TEXT">
                                <div class="row">
                                    <div class="col-6">
                                        <picker set="apple" @select="addEmoji"/>
                                    </div>
                                    <div class="col-6">
                                        <h3>Выбранная эмодзи:</h3>
                                        <p>
                                            <emoji :emoji="block.emoji" :size="40" v-if="block.emoji"/>
                                        </p>

                                        <button class="btn btn-outline-danger" @click.prevent="removeEmoji">Удалить</button>
                                    </div>
                                </div>

                                <vue-editor v-model="block.content" :editorToolbar="customToolbar"></vue-editor>
                            </div>
                            <div v-else>
                                <vue-editor v-model="block.content" :editorToolbar="customToolbar"></vue-editor>
                            </div>
                            <div class="mt-1">
                                <div v-if="index===0" class="btn btn-outline-primary mr-1" @click="insertIndex=-1"
                                     data-toggle="modal"
                                     data-target="#exampleModal">Вставить предыдущий блок
                                </div>
                                <div class="btn btn-outline-primary mr-1" @click="insertIndex=index"
                                     data-toggle="modal"
                                     data-target="#exampleModal">Вставить следующий блок
                                </div>
                                <div class="btn btn-outline-danger" @click="deleteBlock(index)">Удалить</div>
                            </div>
                        </div>

                        <!--Обычное отображение-->
                        <div class="m-1" v-else style="cursor: pointer">
                            <div v-if="block.type===contentType.IMAGE" @click="editImage(index)" class="image-standart">
                                <img v-if="block.content" class="img-fluid" :src="block.content"/>
                                <img v-else class="img-fluid" :src="DEFAULT_IMAGE_URL"/>
                            </div>
                            <div v-else-if="block.type===contentType.YOUTUBE" @click="showEditor(index)">
                                <div v-html="block.content" v-if="block.content"></div>
                                <div v-html="DEFAULT_YOUTUBE_URL" v-else></div>
                            </div>

                            <div v-else-if="block.type===contentType.EXAMPLE && examples!='none'" @click="showEditor(index)">
                                <div 
                                        v-if="block.content && block.content!='Default Content' && block.content!='<p>Default Content</p>'" 
                                        class="d-flex justify-content-center color-example">
                                    <div class="example-label">Пример:</div>
                                    <figure class="ml-auto no-margin-bottom">
                                        <img :src="block.content.url" alt="..." class="img-fluid height-max image-standart">
                                    </figure>
                                </div>
                                <div v-else class="text-italics">Схема не выбрана</div>
                            </div>

                            <div v-else-if="block.type===contentType.LABELED_TEXT" :class="block.type"
                                 @click="showEditor(index)">
                                <div class="labeled_emoji" v-if="block.emoji">
                                    <emoji :emoji="block.emoji" :size="40"/>
                                </div>
                                <div class="labeled_content">
                                    <div v-html="block.content"></div>
                                </div>
                            </div>

                            <div :class="block.type" v-else @click="showEditor(index)">
                                <div v-html="block.content"></div>
                            </div>

                        </div>

                    </div>
                    <div class="btn btn-outline-primary mr-1" @click="insertIndex=blocks.length-1"
                         data-toggle="modal"
                         data-target="#exampleModal">Добавить блок
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Добавить блок</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-for="(value, key) in contentType" :key="key">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="exampleRadios"
                                       :value="value" v-model="insertType">
                                <label class="form-check-label">
                                    {{ contentName[key] }}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" @click.prevent="insertBlock(insertIndex, insertType)"
                                data-dismiss="modal">
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!--Загрузка изображения-->
        <div class="modal fade" id="imageModal" tabindex="-1" role="dialog" aria-labelledby="imageModal"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="imageModalLable">Добавить изображение</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div v-if="checkURL(image_url)">
                            <img :src="image_url" alt="..." class="img-thumbnail">
                        </div>
                        <div class="form-group">
                            <label>From URL</label>
                            <input type="text" class="form-control" placeholder="Enter URL of Image"
                                   v-model="image_url">
                        </div>
                        <div class="form-group">
                            <label>From File</label>
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="customFile"
                                       @change="process_file($event)">
                                <label class=" custom-file-label" for="customFile">{{image_file_name}}</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" @click.prevent="insertImage(edit_index)"
                                data-dismiss="modal">
                            Добавить
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
    import {VueEditor} from 'vue2-editor'
    import {HTTP_UPLOAD} from "../../http-common.js"
    import {Picker, Emoji} from 'emoji-mart-vue'
    import SelectScheme from '../Elements/Modals/SelectScheme.vue'

    export default {
        props: [
            'articleOut',
            'dataReady',
            'examples'
        ],

        components: {
            VueEditor,
            Picker,
            Emoji,
            SelectScheme
        },

        data() {
            return {
                article: "",
                insertIndex: 0,
                insertType: "text",
                show: -1,
                contentType: {
                    "IMAGE": "image",
                    "GOALS": "goals",
                    "EXAMPLE": "example",
                    "TEXT": "text",
                    "LABELED_TEXT": "labeled_text",
                    "YOUTUBE": "youtube"
                },
                contentName: {
                    "IMAGE": 'Изображение',
                    "GOALS": 'Цели',
                    "EXAMPLE": 'Примеры',
                    "TEXT": 'Текст',
                    "LABELED_TEXT": 'Маркированный текст',
                    "YOUTUBE": 'YouTube ролик'
                },
                content: '',
                customToolbar: [
                    [{header: [false, 1, 2, 3]}],
                    ['bold', 'italic', 'underline'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{color: 'red'}],
                ],
                blocks: [],
                image_file: "",
                image_file_name: "Choose file",
                image_url: "",
                edit_index: 0,
                DEFAULT_IMAGE_URL: "http://www.independentmediators.co.uk/wp-content/uploads/2016/02/placeholder-image.jpg",
                DEFAULT_YOUTUBE_URL: "<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&amp;showinfo=0\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" allowfullscreen></iframe>",
                firstDataReady: true,
                exampleImages: [],
                selectScheme: false,
                selectIndex: Number
                //preSavingEditing: false // Сommented - for deleting <p></p> in the beginning and in the end
            }
        },

        methods: {
            // Добавление выбранной схемы в конкретный блок
            schemeSelected(selectedScheme) {
                this.blocks[this.selectIndex].content = selectedScheme;
            },

            // Добавить эмоджи
            addEmoji(emoji) {
                this.$set(this.blocks[this.show], 'emoji', emoji.colons);
            },

            // Удалить эмоджи
            removeEmoji() {
                this.$set(this.blocks[this.show], 'emoji', null);
            },

            // Проверить, не пустой ли путь к изображению
            checkURL(url) {
                return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            },

            // Закрыть редактор
            closeEditor() {
                this.show = -1;
            },

            // Редактировать изображение
            editImage(index) {
                this.show = index;
            },

            // Вставить изображение
            insertImage(index) {
                this.blocks[index].content = this.image_url;
                this.image_url = "";
            },


            // Вставить блок
            insertBlock(index, type) {
                this.show = -1;
                if (type === this.contentType.IMAGE) {
                    this.blocks.splice(index + 1, 0, {"type": type, "content": this.image_url});
                } else if (type === this.contentType.YOUTUBE) {
                    this.blocks.splice(index + 1, 0, {"type": type, "content": this.DEFAULT_YOUTUBE_URL});
                } else {
                    this.blocks.splice(index + 1, 0, {"type": type, "content": "<p>Default Content</p>"});
                }
            },

            // Удалить блок
            deleteBlock(index) {
                let conf = confirm("Удалить блок?");
                if (conf) {
                    this.blocks.splice(index, 1);
                }
            },

            // Активный блок
            showEditor(index) {
                this.show = index;
            },

            // Парсим строку для разбиения по блокам
            prepareForUse() {
                this.article = this.articleOut;
                try {
                    this.blocks = JSON.parse(this.article);
                } catch (err) {
                    console.log(err);
                }
                if (this.examples === 'none') {
                    delete this.contentType.EXAMPLE;
                    delete this.contentName.EXAMPLE;
                }
            },

            // Собираем строку для отправки из блоков
            prepareForSave() {
                /*this.preSavingEditing = true;
                this.blocks.forEach((block) => {
                    if (block.type === this.contentType.TEXT || block.type === this.contentType.LABELED_TEXT) {
                        let contentLength = block.content.length;
                        if (contentLength >= 7) {
                            let contentPart1 = block.content.slice(0, 3);
                            let contentPart2 = block.content.slice(contentLength - 4, contentLength);
                            if (contentPart1 === '<p>' && contentPart2 === '</p>') {
                                block.content = block.content.slice(3, contentLength - 4);
                            }
                        }
                    }
                });*/ // Сommented - for deleting <p></p> in the beginning and in the end
                this.article = JSON.stringify(this.blocks);
                this.$emit('editorUpdated', this.article);
                /*setTimeout(() => {
                    this.preSavingEditing = false;
                }, 4);*/ // Сommented - for deleting <p></p> in the beginning and in the end
            },

            // Обработка загрузки файла
            process_file(event) {
                if (event.target.files[0]) {
                    this.image_file = event.target.files[0];
                    this.image_file_name = this.image_file.name;
                    if (this.image_file.size < 3000000) {
                        this.$notify({
                            group: 'foo',
                            type: "warn",
                            title: 'Пожалуйста, подождите',
                            text: 'Загрузка файла на сервер'
                        });
                        let formData = new FormData();
                        formData.append("file", this.image_file);
                        HTTP_UPLOAD.post('editor/upload_image/', formData)
                            .then((response) => {
                                this.image_url = response.data.url;
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
                    console.log(this.image_file);
                }
            }
        },

        watch: {
            // Отслеживаем получение данных с сервера в родительском компоненте
            dataReady() {
                this.prepareForUse();
            },

            // Отслеживаем все изменения контента и возвращаем их в родительский компонент
            blocks: {
                handler(val, oldVal) {
                    //if (!this.preSavingEditing) {
                    this.prepareForSave();
                    //} // Сommented - for deleting <p></p> in the beginning and in the end
                },
                deep: true
            }
        },

        created() {
            if (this.dataReady) {
                this.prepareForUse();
            }
        }
    }
</script>

<style scoped>
    .example-label {
        padding: 20px;
    }

    .no-margin-bottom {
        margin-bottom: 0;
    }

    .color-example {
        background-color: lightcyan;
        padding: 5px;
        border-radius: 10px;
        border: 1px solid lightcoral;
        font-size: 18px;
    }

    .text-italics {
        font-style: italic;
    }

    .image-standart {
        /*width: 40%;*/
        padding-left: 30%;
        padding-right: 30%;
    }

    .vertical-padding {
        padding-top: 10px;
        padding-bottom: 10px;
    }

    .editor-border {
        border: 1px solid lightgrey;
        border-radius: 2px;
        padding-top: 10px;
        padding-bottom: 10px;
    }

    body {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    ul, ol {
        margin: 0;
    }

    .content-block {
        border-radius: .25rem;
        background: transparent none;
        border: 1px solid rgba(0, 0, 0, .125);
        padding: 5px;
    }

    .custom-file-input {
        cursor: pointer;
    }

    .goals {
        border-radius: .25rem;
        background: rgb(255, 242, 204);
        border: 1px solid rgba(0, 0, 0, .125);
        margin: 10px 0px;
        padding: 5px;
    }

    .example {
        border-radius: .25rem;
        background: #f5f5f5;
        border: 1px solid rgba(0, 0, 0, .125);
        margin: 10px 0px;
        padding: 5px;
    }

    .labeled_text {
        border-radius: .25rem;
        border: 1px solid rgba(255, 21, 31, 0.75);
        margin: 10px 0px;
        padding: 5px;
        display: flex;
    }

    .labeled_emoji {
        width: 60px;
    }

    #article {
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        font-weight: 300;
        color: black;
    }

    #article >>> img {
        width: 100%;
    }

    #article >>> h1 {
        font-size: 3rem;
        text-transform: uppercase;
        font-weight: 900;
    }

    #article >>> h2 {
        font-size: 1.8rem;
        text-transform: uppercase;
        font-weight: 900;
    }

    #article >>> h3 {
        font-size: 1.4rem;
        text-transform: uppercase;
        font-weight: 900;
        color: #2c3e50;
    }

    #article >>> p {
        margin-bottom: 0;
    }

    #article >>> em {
        font-family: 'EB Garamond', serif;
    }
</style>