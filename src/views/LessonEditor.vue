<template>
    <div>
        <!--Пользователей не должно волновать, какие айдишники использовать-->
        <h1 class="component-title">Редактирование урока "{{ lesson.name }}"</h1>
        <!--<h2 class="component-subtitle">Дисциплина {{ lesson.science }}</h2>-->
        <div class="component-content">
            <form>
                <!-- Блок редактирования названия урока, кнопок сохранить на сервере и вернуться назад -->
                <div class="form-group">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="label-subtitle">
                                <label for="name">Название</label>
                            </div>
                            <div class="d-flex">
                                <input
                                        type="text"
                                        id="name"
                                        class="form-control mr-1"
                                        v-model="lesson.name">
                                <div @click="saveLesson" class="btn btn-success mr-1">Сохранить</div>
                                <router-link :to="`/sciences/${ lesson.science }/`" tag="button"
                                             class="btn btn-danger">Отмена
                                </router-link>
                            </div>
                            <!-- Блок редактирования описания урока, редактор Quill -->
                            <div class="form-group">
                                <div class="label-subtitle">
                                    <label for="description">Описание</label>
                                    <p></p>
                                </div>
                                <quill-editor
                                        v-model="lesson.description"
                                        :options="customToolbar"></quill-editor>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <h5>Картинка урока:</h5>
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
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Блок редактирования содержания урока, блочный редактор -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="content">Содержимое</label>
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' :
                            'Показать' }}</p>
                    </div>
                    <div class="form-element-complex" v-if="showContent">
                        <editor-block
                                id="content"
                                :articleOut="lesson.content"
                                :dataReady="dataReady"
                                @editorUpdated="editorUpdated">
                        </editor-block>
                    </div>

                </div>
            </form>
            <!-- Разделённая на 2 колонки часть -->
            <div class="row form-group multi-cols-border">
                <!-- Блок списка вершин урока с возможностью исключить и списка и добавить в него -->
                <div class="col-7">
                    <div class="label-subtitle">
                        <label for="nodes">Вершины урока</label>
                    </div>
                    <div class="form-element nodes-place">
                        <nodes-del-list
                                v-for="(node, index) in nodesSelected"
                                :key="node.index"
                                id="nodes"
                                :index="index"
                                :node="node"
                                @nodeRemoved="nodeRemoved"></nodes-del-list>
                        <div class="add-node-line">
                            <select
                                    class="form-control add-node-select"
                                    v-model="nodeAdding">
                                <option
                                        v-for="node in nodesNotInList"
                                        v-if="!(nodesSelected.find(x => x.id === node.id))"
                                        :value="node.id"
                                        :key="node.id">{{ node.name }}
                                </option>
                            </select>
                            <div
                                    class="btn btn-green btn-common save-cancel-btn add-node-btn"
                                    @click="addNodeToLesson">Добавить
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Блок древа дисциплины -->
                <div class="col-5">
                    <div class="label-subtitle">
                        <label for="tree">Дерево дисциплины</label>
                    </div>
                    <div class="form-element nodes-place tree-place">
                        <!-- ТЕСТ ДРЕВА -->
                        <ol class="node">
                            <tree
                                    class="item"
                                    :node="treeData"
                                    :ready="treeDataReady">
                            </tree>
                        </ol>
                    </div>
                </div>
            </div>
            <!-- Блок списка карточек -->
            <div class="form-group elements-list-margin">
                <div class="label-subtitle">
                    <label for="cards">Карточки: </label>
                    <p @click="showCards = !showCards" class="show-element elements-list-margin">
                        {{ showCards ? 'Скрыть' : 'Показать' }}
                    </p>
                </div>
            </div>
            <items-list-editor v-model="lesson.cards" :props="delProps"></items-list-editor>
            <div class="create-btn-right">
                <!-- Кнопка создания новой карточки -->
                <create-btn
                        :createBtn="createBtn"
                        :requestId="{'lesson_id': lesson.id}"
                        @createBtnUsed="createBtnUsed"></create-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import NameDescList from '../components/Elements/NameDescList.vue';
    import EditorBlock from '../components/Elements/EditorBlock.vue';
    import ItemsListEditor from '../components/Elements/ItemsListEditor'
    import Tree from '../components/LessonEditor/Tree.vue';
    import {HTTP, HTTP_UPLOAD} from '../http-common.js';
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        components: {
            CreateBtn,
            NameDescList,
            EditorBlock,
            Tree,
            ItemsListEditor
        },
        data() {
            return {
                treeData: {
                    children: [],
                    object: {
                        id: 0,
                        name: "",
                        is_property: true
                    }
                },
                nodesNotInList: [],
                nodeAdding: 0,
                lesson: {
                    science: 0,
                    id: 0,
                    name: "",
                    description: "",
                    content: "",
                    nodes: [],
                    tree: {},
                    cards: [{
                        id: 0,
                        name: "",
                        description: ""
                    }]
                },
                createBtn: {
                    name: 'ДОБАВИТЬ КАРТОЧКУ',
                    btnPath: `/${ this.$route.path }cards/`,
                    requestPath: 'cards/'
                },
                dataReady: false,
                treeDataReady: false,
                showContent: true,
                showCards: true,
                delProps: {
                    name: 'карточку',
                    editPath: `${ this.$route.path }cards/`,
                    delLink: 'cards/'
                },
                customToolbar: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline'],
                            [{header: [false, 1, 2, 3]}],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'font': []}],
                            [{'color': []}, {'background': []}],
                            [{'align': []}],
                        ]
                    }
                },
                image_file: "",
                image_url: ""
            }
        },

        computed: {
            ...mapGetters([
                'nodesSelected'
            ])
        },
        watch: {
            treeDataReady: {
                handler(val, oldVal) {
                    this.treeInspect(this.treeData);
                }
            }
        },
        methods: {
            treeInspect(branch) {
                console.log('nodesNotInList');
                console.log(this.nodesNotInList);
                if (!branch.object.is_property) {
                    this.nodesNotInList.push(branch.object);
                }
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.treeInspect(branch.children[childrenVisited]);
                        childrenVisited += 1;
                    }
                }
            },
            addNodeToLesson() {
                if (this.nodeAdding !== 0) {
                    let currentNode = this.nodesNotInList.find(x => x.id === this.nodeAdding); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.nodeAdding = 0;
                    this.toggleNode(currentNode);
                    this.changeNodeSelection(currentNode.id);
                }
                console.log('Attention_1');
                console.log(this.nodesSelected);
            },
            ...mapMutations([
                'clearState',
                'toggleNode',
                'changeNodeSelection',
                'initNodes'
            ]),
            // Функции-обработчики действий из дочерних компонентов
            editorUpdated(content) {
                this.lesson.content = content
            },
            createBtnUsed(newCard) {
                this.lesson.cards.push(newCard)
            },
            elementRemoved(index) {
                this.lesson.cards.splice(index, 1)
            },
            nodeRemoved(index, node) {
                this.toggleNode(node);
                this.changeNodeSelection(node.id);
            },
            // Получение данных с сервера (изначально)
            getData() {
                HTTP.get(`lessons/${ this.$route.params.id }/`)
                    .then(response => {
                        this.lesson = response.data;
                        this.dataReady = true;
                        console.log(this.lesson);
                        this.initNodes(this.lesson.nodes);
                        HTTP.get(`sciences/${ this.lesson.science }/`)
                            .then(response => {
                                this.treeData = response.data.nodes;
                                this.treeDataReady = true;
                                //this.initNodes(this.lesson.nodes);
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
            },
            // Сохранение данных на сервере
            saveLesson() {
                this.lesson.nodes = this.nodesSelected;
                console.log(this.lesson);
                HTTP.put(`lessons/${ this.$route.params.id }/`, this.lesson)
                    .then(response => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Урок загружен на сервер'
                        });
                    })
                    .catch(error => {
                        alert('Ошибка сохранения :( \n Попробуйте ещё раз...');
                        console.log(error);
                        this.$notify({
                            group: 'foo',
                            type: "error",
                            title: 'Произошла ошибка',
                            text: 'Sorry'
                        });
                    });
            },
            process_image(event) {
                if (event.target.files[0]) {
                    let reader = new FileReader();
                    let app = this;
                    reader.onload = function (e) {
                        app.image_url = e.target.result;
                    };
                    app.image_file = event.target.files[0];
                    reader.readAsDataURL(event.target.files[0]);
                }
            },
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
                        HTTP_UPLOAD.put(`lessons/${this.lesson.id}/upload_image/`, formData)
                            .then((response) => {
                                this.$notify({
                                    group: 'foo',
                                    type: "success",
                                    title: 'Успешно загружено',
                                    text: 'Изображение загружено на сервер'
                                });
                                this.image_url = "";
                                this.lesson.image = response.data;
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
                }

            }
        },
        created() {
            this.clearState();
            this.getData();
        }
    }
</script>

<style scoped>
    .add-node-line {
        text-align: center;
        border: 1px solid gray;
        padding: 0;
    }

    .add-node-line:before {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .add-node-btn {
        display: inline-block;
        width: 20%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .add-node-select {
        display: inline-block;
        width: 80%;
        vertical-align: middle;
        margin: 0;
    }

    .node {
        counter-reset: item;
        padding-left: 0;
    }
</style>