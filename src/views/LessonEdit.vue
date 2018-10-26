<template>
    <div class="block-container">
        <h1 class="component-title">Редактирование урока {{ lesson.id }}</h1>
        <h2 class="component-subtitle">Дисциплина {{ lesson.science }}</h2>
        <div class="component-content">
            <form>
                <!-- Блок редактирования названия урока, кнопок сохранить на сервере и вернуться назад -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="name">Название</label>
                    </div>
                    <div class="form-element">
                        <input
                                type="text"
                                id="name"
                                class="form-control save-cancel-input"
                                v-model="lesson.name">
                        <div
                                @click="saveLesson"
                                class="btn btn-green btn-common save-cancel-btn"
                        >SAVE
                        </div> <!-- Button -->
                        <router-link
                                :to="`/sciences/${ lesson.science }/`"
                                tag="button"
                                class="btn btn-red btn-common save-cancel-btn"
                        >CANCEL
                        </router-link>
                    </div>
                </div>
                <!-- Блок редактирования описания урока, редактор Quill -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="description">Описание</label>
                    </div>
                    <div class="form-element">
                        <quill-editor
                                v-model="lesson.description"
                                :options="customToolbar"></quill-editor>
                    </div>
                </div>
                <!-- Блок редактирования содержания урока, блочный редактор -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="content">Содержимое</label>
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' :
                            'Показать' }}</p>
                    </div>
                    <div class="form-element" v-if="showContent">
                        <editor-block
                                id="content"
                                :articleOut="lesson.content"
                                :dataReady="dataReady"
                                @editorUpdated="editorUpdated"></editor-block>
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
                                        v-if="nodesSelected.indexOf(node) == -1"
                                        :value="node.object.id"
                                        :key="node.object.id">{{ node.object.name }}
                                </option>
                            </select>
                            <button
                                    class="btn btn-green btn-common save-cancel-btn add-node-btn"
                                    @click="addNodeToLesson">Добавить
                            </button>
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
                                    :node="treeData">
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
            <name-desc-list
                    v-if="showCards"
                    v-for="(card, index) in lesson.cards"
                    :key="card.id"
                    id="cards"
                    :index="index"
                    :element="card"
                    :delProps="delProps"
                    @elementRemoved="elementRemoved"></name-desc-list>
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
    import NodesDelList from '../components/Elements/NodesDelList.vue';
    import Tree from '../components/LessonEdit/Tree.vue';
    import {HTTP} from '../http-common.js';
    import {mapMutations, mapGetters} from 'vuex';

    export default {
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
                showCards: false,
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
                            ['image', 'video']
                        ]
                    }
                }
            }
        },
        components: {
            CreateBtn,
            NameDescList,
            EditorBlock,
            NodesDelList,
            Tree
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
                if (!branch.object.is_property) {
                    this.nodesNotInList.push(branch);
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.treeInspect(branch.children[childrenVisited]);
                        childrenVisited += 1;
                    };
                };
            },
            addNodeToLesson() {
                if (this.nodeAdding != 0) {
                    let currentNode = this.nodesNotInList.find(x => x.object.id === this.nodeAdding); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.nodeAdding = 0;
                    this.toggleNode(currentNode);
                    this.changeNodeSelection(currentNode.object.id);
                };
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
                this.toggleNode(node)
                this.changeNodeSelection(node.object.id)
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