<template>
    <div 
            class="container editor-border" 
            @mouseleave="onEditorMouseLeave($event)" 
            @mouseenter="onEditorMouseEnter($event)"
            @click="onEditorMouseLeave($event)"
            @keypress="onEditorMouseLeave($event)">
        <!--<picker set="apple" @select="addEmoji"/>-->
        <div class="vertical-padding" @click="closeEditor">
            <input
                    type="text"
                    class="form-control save-cancel-input"
                    v-model="article.name">
            <!--
            <button class="btn btn-green btn-common save-cancel-btn" @click="handleSavingContent">Сохранить</button>
            <button class="btn btn-red btn-common save-cancel-btn" @click="handleDeletingArticle">Удалить</button>
            -->
        </div>
            <!--
            <div class="col-5">
                <h1><input class="form-control" v-model="article.name"/></h1>
            </div>
            -->
        <div id="article">
            <div class="row">
                <div class="col-12">
                    <div v-for="(block, index) in blocks" :key="index">
                        <!--Если включен редактор-->
                        <div class="content-block" v-if="index===show">
                            <div v-if="block.type===contentType.IMAGE">
                                <img v-if="block.content" class="img-fluid" :src="block.content"
                                     style="cursor: pointer;"
                                     data-toggle="modal"
                                     data-target="#imageModal" @click="edit_index=index" alt="...">
                                <img v-else class="img-fluid"
                                     :src="DEFAULT_IMAGE_URL"
                                     style="cursor: pointer;"
                                     data-toggle="modal"
                                     data-target="#imageModal" @click="edit_index=index" alt="...">
                            </div>
                            <div v-else-if="block.type===contentType.LABELED_TEXT">
                                <div class="row">
                                    <div class="col-6">
                                        <picker set="apple" @select="addEmoji"/>
                                    </div>
                                    <div class="col-6">
                                        <h3>Выбранная эмодзи:</h3>
                                        <p><emoji :emoji="block.emoji" :size="40" v-if="block.emoji"/></p>

                                        <button class="btn btn-outline-danger" @click="removeEmoji">Удалить</button>
                                    </div>
                                </div>

                                <vue-editor v-model="block.content" :editorToolbar="customToolbar"></vue-editor>
                            </div>
                            <div v-else>
                                <vue-editor v-model="block.content" :editorToolbar="customToolbar"></vue-editor>
                            </div>
                            <div class="mt-1">
                                <button v-if="index===0" class="btn btn-outline-primary mr-1" @click="insertIndex=-1"
                                        data-toggle="modal"
                                        data-target="#exampleModal">Вставить предыдущий блок
                                </button>
                                <button class="btn btn-outline-primary mr-1" @click="insertIndex=index"
                                        data-toggle="modal"
                                        data-target="#exampleModal">Вставить следующий блок
                                </button>
                                <button class="btn btn-outline-danger" @click="deleteBlock(index)">Удалить</button>
                            </div>
                        </div>
                        <!--Обычное отображение-->
                        <div class="m-1" v-else style="cursor: pointer">
                            <div v-if="block.type===contentType.IMAGE" @click="editImage(index)">
                                <img v-if="block.content" class="img-fluid" :src="block.content"/>
                                <img v-else class="img-fluid" :src="DEFAULT_IMAGE_URL"/>
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
                    <button class="btn btn-outline-primary mr-1" @click="insertIndex=blocks.length-1"
                            data-toggle="modal"
                            data-target="#exampleModal">Добавить блок
                    </button>
                </div>
                <!--
                <div class="col-3" @click="closeEditor">
                    <button class="btn mr-2 btn-green btn-common" @click="handleSavingContent">Сохранить</button>
                    <button class="btn btn-red btn-common" @click="handleDeletingArticle">Удалить</button>
                </div>
                -->
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
                                    {{key}}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" @click="insertBlock(insertIndex, insertType)"
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
                        <button type="button" class="btn btn-primary" @click="insertImage(edit_index)"
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
    import {HTTP, HTTP_UPLOAD} from "../../http-common.js";
    import {Picker, Emoji} from 'emoji-mart-vue'

    export default {
        props: [
            'requestPath',
            'article',
            'dataReady'
        ],

        components: {
            VueEditor,
            Picker,
            Emoji
        },

        data() {
            return {
                //article: "",
                insertIndex: 0,
                insertType: "text",
                show: -1,
                contentType: {
                    "IMAGE": "image",
                    "GOALS": "goals",
                    "EXAMPLE": "example",
                    "TEXT": "text",
                    "LABELED_TEXT": "labeled_text",
                },
                content: '',
                customToolbar: [
                    [{header: [false, 1, 2, 3]}],
                    ['bold', 'italic', 'underline'],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{color: 'red'}],
                    [/*'link', */'image', 'video']
                ],
                blocks: [],
                image_file: "",
                image_file_name: "Choose file",
                image_url: "",
                edit_index: 0,
                DEFAULT_IMAGE_URL: "http://www.independentmediators.co.uk/wp-content/uploads/2016/02/placeholder-image.jpg",
                firstDataReady: true
            }
        },
        methods: {
            addEmoji(emoji) {
                this.$set(this.blocks[this.show], 'emoji', emoji.colons);
                console.log(emoji);
            },
            removeEmoji() {
                this.$set(this.blocks[this.show], 'emoji', null);
            },
            checkURL(url) {
                return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            },
            closeEditor() {
                this.show = -1;
                console.log("close");
            },
            editImage(index) {
                this.show = index;
                console.log("Popup for upload Image")
            },
            insertImage(index) {
                this.blocks[index].content = this.image_url;
                this.image_url = ""
            },
            insertBlock(index, type) {
                console.log("Insert Block");
                this.show = -1;
                if (type === this.contentType.IMAGE) {
                    this.blocks.splice(index + 1, 0, {"type": type, "content": this.image_url})
                }
                else {
                    this.blocks.splice(index + 1, 0, {"type": type, "content": "<p>Default Content</p>"})
                }
            },
            deleteBlock(index) {
                let conf = confirm("Удалить блок?");
                if (conf) {
                    this.blocks.splice(index, 1);
                }
            },
            showEditor(index) {
                this.show = index;
                console.log("show")
            },
            onEditorMouseEnter(editor) {
                if (this.dataReady & this.firstDataReady) {
                    //this.content = this.contentForEditor;
                    this.firstDataReady = false;
                    this.prepareForUse(this.contentForEditor);
                    console.log('MouseEnter!');
                }
            },
            onEditorMouseLeave(editor) {
                console.log('MOUSE-Editor!');
                //this.$emit('quilUpdated', this.content)
                this.prepareForSave();
                this.$emit('editorUpdated', this.article);
                if (this.dataReady & this.firstDataReady) {
                    //this.content = this.contentForEditor;
                    this.firstDataReady = false;
                    this.prepareForUse();
                }
            },
            prepareForUse() {
                try {
                    this.blocks = JSON.parse(this.article['content'])
                } catch (err) {
                    console.log(err);
                }
            },
            prepareForSave() {
                this.article['content'] = JSON.stringify(this.blocks);
            },
            /*handleSavingContent: function () {
                this.article['content'] = JSON.stringify(this.blocks);
                HTTP.put(this.requestPath + this.$route.params.id + '/', this.article)
                    .then((response) => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Статья была загружена на сервер'
                        });
                    })
                    .catch((error) => {
                        this.$notify({
                            group: 'foo',
                            type: "error",
                            title: 'Произошла ошибка',
                            text: 'Sorry'
                        });
                    })
            },*/
            /*handleDeletingArticle: function () {
                if (confirm("Удалить статью?")) {
                    HTTP.delete(this.requestPath + this.$route.params.id + '/')
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Статья была удалена из сервера'
                            });
                            this.$router.push('/')
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            },*/
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
                        HTTP_UPLOAD.post('upload_image/', formData)
                            .then((response) => {
                                this.image_url = response.data;
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
                    }
                    else {
                        this.$notify({
                            group: 'foo',
                            type: "warn",
                            title: 'Слишком большой файл',
                            text: 'Уменьшите изображение'
                        });
                    }
                    console.log(this.image_file);
                }
            },
        },
        created() {
            /*HTTP.get(this.requestPath + this.$route.params.id + '/')
                .then((response) => {
                    this.article = response.data;
                    try {
                        this.blocks = JSON.parse(this.article['content'])
                    } catch (err) {
                        console.log(err);
                    }
                })
                .catch((error) => {
                    this.$notify({
                        group: 'foo',
                        type: "error",
                        title: 'Произошла ошибка',
                        text: 'Sorry'
                    });
                });*/
            setTimeout(() => {
                if (this.dataReady & this.firstDataReady) {
                    //this.content = this.contentForQuil;
                    this.firstDataReady = false;
                    this.prepareForUse(this.contentForEditor);
                }
            }, 300),
            setTimeout(() => {
                if (this.dataReady & this.firstDataReady) {
                    //this.content = this.contentForQuil;
                    this.firstDataReady = false;
                    this.prepareForUse(this.contentForEditor);
                }
            }, 1000)
        }
    }
</script>

<style scoped>
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

    .editor-border:hover {
        border: 1px solid lightsalmon;
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
        /*margin: 10px;*/
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

    #article img {
        width: 100%;
    }

    #article h1 {
        font-size: 3rem;
        text-transform: uppercase;
        font-weight: 900;
    }

    #article h2 {
        font-size: 1.8rem;
        text-transform: uppercase;
        font-weight: 900;
    }

    #article h3 {
        font-size: 1.4rem;
        text-transform: uppercase;
        font-weight: 900;
        color: #2c3e50;
    }

    #article p {
        margin-bottom: 0;
    }

    #article em {
        font-family: 'EB Garamond', serif;
    }
</style>