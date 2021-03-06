<template>
    <div>
        <h1 class="component-title">Редактирование карточки "{{ card.name }}"</h1>
        
        <!-- Отображение спиннера, если нет соединения с сервером -->
        <!-- При div почему-то не работает... -->
        <p class="text-center" v-if="!treeStartReady">
            <i class='fa fa-spinner fa-pulse fa-4x'></i>
        </p>
        
        <!-- Страница редактирования карточки, если есть соединение с сервером -->
        <div class="component-content mb-3" v-else>
            <form>

                <!-- Блок редактирования названия карточки, кнопок сохранить на сервере и вернуться назад -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="name">Название</label>
                    </div>
                    <div class="form-element">
                        <input
                                type="text"
                                id="name"
                                class="form-control save-cancel-input mr-1"
                                v-model="card.name">
                        <button @click.prevent="saveCard" class="btn btn-success mr-1">Сохранить</button>
                        <router-link :to="`/sciences/${ card.science }/lessons/${ card.lesson }/`"
                                     tag="button" class="btn btn-danger">Отмена
                        </router-link>
                    </div>
                </div>

                <!-- Блок редактирования описания карточки, редактор Quill -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="description">Описание</label>
                    </div>
                    <div class="form-element">
                        <quill-editor
                                v-model="card.description"
                                :options="customToolbar"></quill-editor>
                    </div>
                </div>

                <!-- Разделённая на 2 колонки часть -->
                <div class="row form-group multi-cols-border">

                    <!-- Блок списка вершин карточки с возможностью исключить и списка и добавить в него -->
                    <div class="col-8">
                        <div class="label-subtitle">
                            <label for="nodes">Вершины карточки</label>
                        </div>
                        <div class="form-element nodes-place">

                            <!-- Список вершин карточки с возможностью исключения из него-->
                            <nodes-del-list
                                    v-for="(node, index) in nodesSelected"
                                    :key="node.index"
                                    id="nodes"
                                    :index="index"
                                    :node="node"
                                    @nodeRemoved="nodeRemoved"></nodes-del-list>

                            <!-- Выбор вершины для добавления в список вершин карточки -->
                            <div class="add-node-line">
                                <select class="form-control add-node-select" v-model="nodeAdding">
                                    <option
                                            v-for="node in treeList"
                                            v-if="nodesSelected.indexOf(node) == -1"
                                            :value="node.id"
                                            :key="node.id">{{ node.name }}
                                    </option>
                                </select>
                                <button class="btn btn-green btn-common save-cancel-btn add-node-btn"
                                     @click.prevent="addNodeToCard">Добавить
                                </button>
                            </div>

                        </div>
                    </div>

                    <!-- Блок древа урока -->
                    <div class="col-4">
                        <div class="label-subtitle">
                            <label for="tree">Дерево урока</label>
                        </div>
                        <div class="form-element nodes-place tree-place">

                            <!-- Древо урока -->
                            <ul>
                                <tree-register
                                        v-for="node in treeList"
                                        :key="node.id"
                                        id="tree"
                                        class="item"
                                        :ready="treeStartReady"
                                        :node="node">
                                </tree-register>
                            </ul>

                        </div>
                    </div>

                </div>

                <!-- Блок редактирования содержания карточки -->
                <div class="label-subtitle">
                    <label for="content">Содержимое</label>
                    <p @click="showContent = !showContent" class="show-element">
                        {{ showContent ? 'Скрыть' : 'Показать' }}
                    </p>
                </div>

                <!-- Блок редактирования содержания карточки -->
                <div class="form-element-complex" v-if="showContent">
                    <button class="btn btn-orange btn-common btn-generate" @click.prevent="generateFromNodes">Сгенерировать из вершин</button>
                    <editor-block
                            id="content"
                            :articleOut="card.content"
                            :dataReady="dataWithExamplesReady"
                            :examples="exampleImages"
                            @editorUpdated="editorUpdated"></editor-block>
                </div>

            </form>

            <!-- Блок тренажёров карточек -->
            <div class="form-group elements-list-margin">
                <div class="label-subtitle">
                    <label for="cards">Тренажёры: </label>
                    <p @click="showTrainer = !showTrainer" class="show-element elements-list-margin">
                        {{ showTrainer ? 'Старая версия' : 'Новая версия' }}
                    </p>
                </div>
            </div>

            <!-- Old version -->
            <div v-if="!showTrainer" class="mb-5">

                <!-- ААМ -->
                <div class="d-flex mb-2">
                    <h3>AAM:</h3>
                    <div v-if="card.aam_name" class="d-flex ml-5">
                        <h3 class="green mr-5">{{card.aam_name}}</h3>
                        <button class="btn btn-danger" @click.prevent="remove_aam">Удалить</button>
                    </div>
                    <h3 v-else class="red"> нет данных</h3>
                </div>

                <div>
                    <div class="row">
                        
                        <!-- Загрузка файла -->
                        <div class="col-4">
                            <input type="file" name="file" id="file" class="inputfile" @change="process_file($event)"/>
                        </div>

                        <!-- Кнопка создания нового тренажёра крточки -->
                        <div class="col-4">
                            <button @click.prevent="upload_aam" class="btn btn-green btn-oval">Добавить тренажёр</button>
                        </div>

                    </div>
                </div>

            </div>

            <!-- New version -->
            <div v-if="showTrainer">
                <card-sentences 
                        :url_id="card.id"
                        :card_aams="card.aams"
                        @exampleImagesChanged="exampleImagesUpdate"
                        :ready="dataReady"></card-sentences>
            </div>

        </div>
    </div>
</template>

<script>
    import EditorBlock from '../components/Elements/EditorBlock.vue'
    import NodesDelList from '../components/Elements/NodesDelList.vue'
    import TreeRegister from '../components/CardEditor/TreeRegister.vue'
    import CardSentences from '../components/CardEditor/CardSentences.vue'
    import {HTTP, HTTP_UPLOAD} from '../http-common.js'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                card: {
                    id: 0,
                    name: "",
                    description: "",
                    content: "",
                    nodes: [],
                    lesson: 0,
                    science: 0,
                    time: 0,
                    aams: []
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
                            ['image', 'video']
                        ]
                    }
                },
                nodeAdding: 0,
                treeList: [],
                scienceTreeData: {},
                lessonTreeData: [],
                dataReady: false,
                showContent: true,
                showTrainer: true,
                treeStartReady: false,
                treeDataReady: 0,
                aam_file: undefined,
                exampleImages: [],
                dataWithExamplesReady: false
            };
        },

        components: {
            EditorBlock,
            NodesDelList,
            TreeRegister,
            CardSentences
        },

        computed: {
            ...mapGetters([
                'nodesSelected'
            ])
        },

        watch: {
            // Отслеживание готовности данных для работы с древом
            treeDataReady: {
                handler(val, oldVal) {
                    if (this.treeDataReady === 2) {
                        this.treeStartReady = true;
                        if (this.lessonTreeData.length > 0) {
                            this.treeNodesToBuild(this.scienceTreeData, this.lessonTreeData.map(x => x.id));
                        }
                        this.treeDataReady = 0;
                    }
                }
            },
        },

        methods: {
            // Принимаем данные схем для использования в блочном редакторе
            exampleImagesUpdate(schemes) {
                if (schemes) {
                    this.exampleImages = schemes;
                }
                this.dataWithExamplesReady = true;
            },

            // Сгенерировать содержание карточки из content вершин карточки
            generateFromNodes() {
                let permission = true;
                if (this.card.content != "") {
                    if (!confirm('При создании описании карточки из вершины текущее описание будет удалено.\nПродолжить всё равно?')) {
                        permission = false;
                    }
                }
                if (permission) {
                    let contentToEditor = ""
                    let nodesArr = this.card.nodes;
                    nodesArr.forEach((node, i, nodesArr) => {
                        if (node.content != "") {
                            contentToEditor = contentToEditor + node.content.slice(1, -1) + ",";
                        }
                    });
                    if (contentToEditor != "") {
                        // Выглядит как костыль, но JSON.stringify здесь работает некорректно
                        contentToEditor = contentToEditor.slice(0, -1);
                        contentToEditor = '[' + contentToEditor + ']';
                        this.card.content = contentToEditor;
                        this.dataReady =! this.dataReady;
                    }
                }
            },

            // Получения списка нод из древа
            treeNodesToBuild(branch, storage) {
                if (storage.indexOf(branch.object.id) !== -1) {
                    this.treeList.push(branch.object);
                }
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.treeNodesToBuild(branch.children[childrenVisited], storage);
                        childrenVisited += 1;
                    }
                }
            },

            // Считывание информации из блочного редактора
            editorUpdated(content) {
                this.card.content = content;
            },

            // Добавление ноды в список нод карточки
            addNodeToCard() {
                if (this.nodeAdding !== 0) {
                    let currentNode = this.treeList.find(x => x.id === this.nodeAdding);
                    this.nodeAdding = 0;
                    this.toggleNode(currentNode);
                    this.changeNodeSelection(currentNode.id);
                }
            },
            
            // Удаление ноды из списка нод карточки
            nodeRemoved(index, node) {
                this.toggleNode(node);
                this.changeNodeSelection(node.id);
            },

            ...mapMutations([
                'clearState',
                'toggleNode',
                'changeNodeSelection',
                'initNodes'
            ]),

            // Сохранение данных карточки на сервере
            saveCard() {
                this.card.nodes = this.nodesSelected;
                this.card.time = parseInt(this.card.time);
                HTTP.put(`editor/cards/${ this.$route.params.id }/`, this.card)
                    .then(response => {
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Урок загружен на сервер'
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

            // Получение данных карточки с сервера
            getData() {
                HTTP.get(`editor/cards/${ this.$route.params.id }/`)
                    .then(response => {
                        this.card = response.data;
                        this.initNodes(this.card.nodes);
                        this.dataReady = true;
                        
                        // Получение данных для древа с сервера
                        HTTP.get(`editor/sciences/${ this.card.science }/`)
                            .then(response => {
                                this.scienceTreeData = response.data.nodes;
                                this.treeDataReady += 1;
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

                        // Получение с сервера нод, задействованных в уроке
                        HTTP.get(`editor/lessons/${ this.card.lesson }/`)
                            .then(response => {
                                this.lessonTreeData = response.data.nodes;
                                this.treeDataReady += 1;
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

            // Обработка загрузки файла
            process_file(event) {
                this.aam_file = event.target.files[0];
            },

            // Загрузка ААМ файла
            upload_aam() {
                if (this.aam_file) {
                    this.$notify({
                        group: 'foo',
                        type: "waring",
                        title: 'Пожалуйста, подождите',
                        text: 'Производится загрузка на сервер'
                    });
                    let formData = new FormData();
                    formData.append("file", this.aam_file);
                    HTTP_UPLOAD.put(`editor/cards/${this.card.id}/upload_aam/`, formData)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно загружено',
                                text: 'Архив загружен на сервер'
                            });
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
            },

            // Удаление ААМ файла
            remove_aam() {
                if (confirm("Удалить тренажер?")) {
                    HTTP.post(`editor/cards/${this.card.id}/remove_aam/`)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Тренажеры удалены с сервера'
                            });
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

    .btn-generate {
        margin-bottom: 10px;
        border-radius: 20px;
        background-color: gold;
    }

    .btn-generate:hover {
        background-color: goldenrod;
    }

    .injected-content-place {
        margin: 1px auto;
        padding: 10px;
        border-radius: 3px;
    }

    .time-input {
        width: 200px;
    }

    li {
        display: block
    }

    .selected {
        background-color: lightgreen;
        border-color: black
    }

    .green {
        color: forestgreen;
    }
</style>
