<template>
    <div class="block-container">
        <h1 class="component-title">Дисциплина {{ science.id }}</h1>
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
                            <div class="form-group">Hазвание, вниз-вверх, удаление</div>
                            <!-- Блок перемещения ноды в другое место -->
                            <div class="form-group">Перемещение в другое место</div>
                            <!-- Блок создания новой ноды: в текущем месте или в конце списка -->
                            <div class="form-group">Новая вершина в конец или здесь</div>
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
                                            <p>{{ currentNode.object.content }}</p>
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
    import TreeEdit from '../components/DiscTree/TreeEdit.vue';
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
                        if (this.currentNode.object.id != 0) {
                            this. science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                        };
                        this.nodeSearch(this.science.nodes, this.editingNode);
                        this.editDataReady = !this.editDataReady;
                        this.checkEditorState();
                        console.log('editDataReady!');
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
            checkEditorState() { ///////////////////////////////////////////////////////////////////////////////////////////
                if (this.showContent && this.editingNode != -1) {
                    this.editDataReady = !this.editDataReady;
                    //setTimeout(this.editDataReady = !this.editDataReady, 100);
                    console.log('And now?');
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
                    this. science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                };
                console.log(this.science);
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

</style>
