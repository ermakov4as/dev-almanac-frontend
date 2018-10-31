<template>
    <div class="block-container">
        <h1 class="component-title">Дисциплина "{{ science.name }}"</h1>
        <div class="component-content">
            <!-- Разделённая на 2 колонки часть -->
            <div class="row form-group multi-cols-border">
                <!-- Блок древа урока -->
                <div class="col-4 border-right bottom-places">
                    <div class="label-subtitle-center">
                        <label for="tree">Дерево знания</label>
                    </div>
                    <div class="form-element nodes-place tree-place">
                        <!-- ТЕСТ ДРЕВА -->
                        <ol class="node">
                            <tree-edit
                                    class="item"
                                    :node="science.nodes">
                            </tree-edit>
                        </ol>
                    </div>
                </div>
                <!-- Блок редактирования древа -->
                <div class="col-8 top-bottom-places">
                    <form>
                        <div class="form-group">
                            <div class="form-element">
                                <div
                                        @click="saveTree"
                                        class="btn btn-green btn-common btn-half-place"
                                        >SAVE</div>
                                <router-link
                                        to="/sciences/"
                                        tag="button"
                                        class="btn btn-red btn-common btn-half-place"
                                        >CANCEL</router-link>
                            </div>
                        </div>
                        <template v-if="editingNode != -1">   
                            <!-- Блок названия, перемещения вверх-вниз и удаления ноды --> 
                            <div class="form-group">
                                <div class="form-element">
                                    <input
                                            type="text"
                                            id="name"
                                            class="form-control node-delete-input"
                                            v-model="currentNode.object.name">
                                    <div 
                                            class="btn btn-red btn-common btn-delete-node"
                                            @click="deleteNode">
                                        Удалить {{ currentNode.object.is_property ? 'вершину' : 'свойство' }}</div>
                                </div>
                            </div>
                            <!-- Блок перемещения ноды в другое место -->
                            <div class="form-group">Перемещение в другое место</div>
                            <!-- Блок создания новой ноды: в текущем месте или в конце списка -->
                            <div class="form-group">
                                <div class="label-subtitle">
                                    <label for="create">Добавление вершины</label>
                                </div>
                                <div class="form-element-nf">
                                    <input
                                            type="text"
                                            id="name"
                                            class="form-control node-name-input"
                                            v-model="newNodeName.core">
                                    <div 
                                            class="btn btn-green btn-oval btn-half-place"
                                            @click="addNode('core')">Добавить свойство в корень</div>
                                </div>
                                <div class="form-element">
                                    <input
                                            type="text"
                                            id="name"
                                            class="form-control node-name-input"
                                            v-model="newNodeName.child">
                                    <div 
                                            class="btn btn-orange btn-oval btn-half-place"
                                            @click="addNode('child')">
                                        Добавить {{ currentNode.object.is_property ? 'дочернюю вершину' : 'дочернее свойство' }}</div>
                                </div>
                            </div>
                            <!-- Блок редактирования содержимого вершины / свойства -->
                            <div class="form-group" v-if="!currentNode.object.is_property">
                                <div class="label-subtitle">
                                    <label for="content">Редактирование содержимого</label>
                                    <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' :
                                        'Показать' }}</p>
                                </div>
                                <div class="component-content bottom-places" v-if="showContent">
                                    <div class="form-group">
                                        <div class="label-subtitle">
                                            <label for="tmp">Временная информация</label>
                                        </div>
                                        <div class="form-element" id="tmp">
                                            <quill-editor
                                                    v-model="currentNode.object.tmp"
                                                    :options="customToolbar"></quill-editor>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="label-subtitle">
                                            <label for="description">Описание вершины</label>
                                        </div>
                                        <div class="form-element" id="description">
                                            <quill-editor
                                                    v-model="currentNode.object.description"
                                                    :options="customToolbar"></quill-editor>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="label-subtitle">
                                            <label for="content">Содержимое вершины</label>
                                        </div>
                                        <div class="form-element" id="content">
                                            <editor-block
                                                :articleOut="currentNode.object.content"
                                                :dataReady="editDataReady"
                                                @editorUpdated="editorUpdated"></editor-block>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TreeEdit from '../components/ScienceTree/TreeEdit.vue';
    import EditorBlock from '../components/Elements/EditorBlock.vue';
    import { HTTP } from '../http-common.js';
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        data() {
            return {
                science: {
                    id: 0,
                    nodes: {
                        object: {
                            id: 0
                        },
                        children: []
                    }
                },
                treeDataReady: false,
                showContent: false,
                editDataReady: false,
                newNodeDetected: false,
                newNodeName: {
                    core: "",
                    child: ""
                },
                currentNode: {
                    children: [],
                    object: {
                        id: 0,
                        name: "",
                        tmp: "",
                        description: "",
                        content: ""
                    }
                },
                currentTmpId: -2,
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
            };
        },
        components: {
            EditorBlock,
            TreeEdit
        },
        computed: {
            ...mapGetters([
                'editingNode'
            ])
        },
        watch: {
            editingNode: {
                handler(val, oldVal) {
                    if (this.editingNode != -1) {
                        this.editDataReady = false;
                        if (this.currentNode.object.id != 0) {
                            this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                        };
                        this.nodeSearch(this.science.nodes, this.editingNode);
                        this.editDataReady = !this.editDataReady;
                        this.checkEditorState();
                    }
                }
            },
            showContent: {
                handler(val, oldVal) {
                    this.checkEditorState();
                }
            }
        },
        methods: {
            deleteNode() {
                if (this.science.nodes.object.id != this.currentNode.object.id) {
                    this.science.nodes = this.deleteCurrentNode(this.science.nodes, this.currentNode);
                } else {
                    alert('Нельзя удалить корневую вершину!');
                };
            },
            deleteCurrentNode(branch, node) {
                if (branch.children) {
                    if (branch.children.find(x => x.object.id === node.object.id)) {
                        console.log('Point one');
                        let index = branch.children.indexOf(node);
                        console.log('Point two');
                        branch.children.splice(index, 1);
                        this.clearEditing();
                    };
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.deleteCurrentNode(branch.children[childrenVisited], node);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },
            deleteTmpIds(branch) {
                //console.log(branch.object.id);
                if (branch.object.id < -1) {
                    delete branch.object.id;
                    //console.log('deleted');
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.deleteTmpIds(branch.children[childrenVisited]);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },
            giveTmpId(node) {
                node.object.id = this.currentTmpId;
                this.currentTmpId -= 1;
            },
            addNode(mode) {
                let newNode = {
                    children: [],
                    object: {
                        id: 0,
                        name: "",
                        is_property: true
                    }
                };
                if (mode === 'core' && this.newNodeName.core != "") {
                    newNode.object.name = this.newNodeName.core;
                    this.giveTmpId(newNode);
                    this.science.nodes.children.push(newNode);
                    this.newNodeName.core = "";
                    console.log('core');
                    console.log(this.science.nodes);
                };
                if (mode === 'child' && this.newNodeName.child != "") {
                    console.log(this.currentNode);
                    if (this.currentNode.object.is_property) {
                        console.log('it is property"s child');
                        newNode.object.is_property = false;
                        newNode.object.tmp = "";
                        newNode.object.description = "";
                        newNode.object.content = "";
                    };
                    newNode.object.name = this.newNodeName.child;
                    this.giveTmpId(newNode);
                    this.currentNode.children.push(newNode);
                    this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                    this.newNodeName.child = "";
                    console.log('child');
                    console.log(this.currentNode);
                };
                this.newNodeDetected = true;
            },
            checkEditorState() { ///////////////////////////////////////////////////////////////////////////////////////////
                if (this.showContent && this.editingNode != -1) {
                    this.editDataReady = true;
                    //console.log('And now?');
                }
            },
             nodeSaveToNodes(branch, node) {
                if (branch.object.id === node.object.id) {
                    branch = node;
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.nodeSaveToNodes(branch.children[childrenVisited], node);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },
            nodeSearch(branch, id) {
                if (branch.object.id === id) {
                    this.currentNode = branch;
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.nodeSearch(branch.children[childrenVisited], id);
                        childrenVisited += 1;
                    };
                };
            },
            editorUpdated(content) {
                this.currentNode.object.content = content
            },
            ...mapMutations([
                'clearEditing'
            ]),
            // Получение данных с сервера (изначально)
            getData() {
      		    HTTP.get(`sciences/${ this.$route.params.id }/`)
                    .then(response => {
                        this.science = response.data;
                        console.log(this.science);
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
            },
             saveTree() {
                 if (this.currentNode.object.id != 0) {
                    this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                };
                if (this.newNodeDetected) {
                    this.science.nodes = this.deleteTmpIds(this.science.nodes);
                };
                console.log(this.science.nodes);
                HTTP.put(`sciences/${ this.$route.params.id }/upload_tree/`, this.science)
                    .then(response => {
                        alert('Сохранено!');
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Дисциплина загружена на сервер'
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
            }
        },
        created() {
            this.clearEditing();
            this.getData();
        }
    }
</script>

<style scoped>
    .btn-delete-node {
        display: inline-block;
        width: 30%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .node-delete-input {
        display: inline-block;
        width: 70%;
        vertical-align: middle;
    }
</style>
