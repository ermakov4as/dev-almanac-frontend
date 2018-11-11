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
                        <!-- Отображение древа -->
                        <ol class="node">
                            <tree-edit class="item" :node="science.nodes"></tree-edit>
                        </ol>
                    </div>
                </div>

                <!-- Блок редактирования древа -->
                <div class="col-8 top-bottom-places">
                    <form>

                        <!-- Кнопки сохранения древа и возврата на страницу списка дисциплин -->
                        <div class="form-group">
                            <div class="form-element">
                                <div @click="saveTree" class="btn btn-success mr-1">Сохранить</div>
                                <router-link :to="`/sciences/`" tag="button" class="btn btn-danger">Отмена</router-link>
                            </div>
                        </div>

                        <!-- Блок редактирования ноды показывается только если нода выбрана -->
                        <template v-if="editingNode != -1">   
                            <!-- Блок названия, перемещения вверх-вниз и удаления ноды. Не работает для корневой вершины --> 
                            <div class="form-group" v-if="currentNode.object.id != science.nodes.object.id">
                                <div class="form-element">
                                    <div class="btns-vertical">
                                        <div 
                                                class="btn btn-blue btn-move"
                                                :class="{disabled: !moveAccess.up}"
                                                @click="nodeMove('up')">
                                                    <i class="material-icons">
                                                        keyboard_arrow_up
                                                    </i>
                                                </div>
                                        <div 
                                                class="btn btn-blue btn-move"
                                                :class="{disabled: !moveAccess.down}"
                                                @click="nodeMove('down')">
                                                    <i class="material-icons">
                                                        keyboard_arrow_down
                                                    </i>
                                                </div>
                                    </div>
                                    <input
                                            type="text"
                                            id="name"
                                            class="form-control node-delete-input"
                                            v-model="currentNode.object.name">
                                    <div    
                                            class="btn btn-red btn-common btn-delete-node"
                                            @click="deleteNode">
                                        Удалить {{ !currentNode.object.is_property ? 'вершину' : 'свойство' }}</div>
                                </div>
                            </div>

                            <!-- Блок перемещения вершины под другое свойство. Работает только для вершин. Не работает для корневой вершины -->
                            <div class="form-group" v-if="!currentNode.object.is_property &&  (currentNode.object.id != science.nodes.object.id)">
                                <div class="label-subtitle">
                                    <label for="move">Переместить в другое место</label>
                                </div>
                                <div class="form-element">
                                    <div class="add-node-line">

                                        <!-- Выбор вершины, под свойство которой переместить текущую --> 
                                        <select
                                                class="form-control add-node-select"
                                                v-model="moveToOther.node">
                                            <option
                                                    v-if="nodesToMoveExist"
                                                    v-for="node in allNodes"
                                                    :value="node"
                                                    :key="node.object.id">{{ node.object.name }}
                                            </option>
                                        </select>

                                        <!-- Выбор свойства, под которое переместить текущую вершину -->
                                        <select
                                                class="form-control add-node-select"
                                                v-model="moveToOther.prop">
                                            <option
                                                    v-for="node in moveToOther.node.children"
                                                    :value="node"
                                                    :key="node.object.id">{{ node.object.name }}
                                            </option>
                                        </select>
                                        <div
                                                class="btn btn-green btn-common save-cancel-btn add-node-btn"
                                                @click="changeNodeLocation">Ok
                                        </div>

                                    </div>

                                </div>
                            </div>

                            <!-- Блок создания новой ноды: в текущем месте или в конце списка -->
                            <div class="form-group">
                                <div class="label-subtitle">
                                    <label for="create">Добавление вершины</label>
                                </div>

                                <!-- Добавление свойства в корень -->
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

                                <!-- Добавление ноды "под" текущую -->
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

                            <!-- Блок редактирования содержимого вершины. Не работает для свойств  -->
                            <div class="form-group" v-if="!currentNode.object.is_property">
                                <div class="label-subtitle">
                                    <label for="content">Редактирование содержимого</label>
                                    <p @click="showContent = !showContent" class="show-element">
                                        {{ showContent ? 'Скрыть' : 'Показать' }}
                                    </p>
                                </div>

                                <!-- Работает при выборе раскрытия -->
                                <div class="component-content bottom-places" v-if="showContent">
                                    
                                    <!-- Редактирование свойства вершины tmp -->
                                    <div class="form-group">
                                        <div class="label-subtitle">
                                            <label for="tmp">Временная информация вершины</label>
                                        </div>
                                        <div class="form-element" id="tmp">
                                            <quill-editor
                                                    v-model="currentNode.object.tmp"
                                                    :options="customToolbar"></quill-editor>
                                        </div>
                                    </div>
                            
                                    <!-- Редактирование описания вершины -->
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
                                
                                    <!-- Редактирование содержания вершины через блочный редактор -->
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
                nodesToMoveExist: false,
                moveToOther: {
                    node: {
                        object: {},
                        children: [
                            {
                                object: {},
                                children: []
                            }
                        ]
                    },
                    prop: {
                        object: {},
                        children: []
                    } 
                },
                allNodes: [],
                newNodeName: {
                    core: "",
                    child: ""
                },
                moveAccess: {
                    up: false,
                    down: false
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
                            [{'align': []}]
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
            // Отслеживание выбранной ноды
            editingNode: {
                handler(val, oldVal) {
                    // Только для ноды, существующей в древе
                    if (this.editingNode != -1) {
                        // По умолчанию блокируем возможность перемещения новы вверх/вниз 
                        this.moveAccess = {
                            up: false,
                            down: false
                        };
                        this.editDataReady = false;
                        // Сохраняем в science.nodes изменения предыдущей активной ноды, если она была
                        if (this.currentNode.object.id != 0) {
                            this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                        };
                        this.allNodes = [];
                        this.nodeSearch(this.science.nodes, this.editingNode);
                        this.moveToOther = {
                            node: {
                                object: {},
                                children: [
                                    {
                                        object: {},
                                        children: []
                                    }
                                ]
                            },
                            prop: {
                                object: {},
                                children: []
                            }
                        },
                        this.editDataReady = !this.editDataReady;
                        this.checkEditorState();
                        //this.checkMoveAccess(this.science.nodes, this.currentNode);
                    };
                }
            },

            // Отслеживаем включение/отключение режима показа редактирования дополнительных свойств ноды
            showContent: {
                handler(val, oldVal) {
                    this.checkEditorState();
                }
            },

            // Отслеживание изменений массива вершин, в которые потенциально можно переместить другую вершину
            allNodes: {
                handler(val, oldVal) {
                    // Обеспечиваем задержку при смене активной ноды для исключени обращений к несуществующим элементам
                    if (this.allNodes.length > 0) {
                        setTimeout(() => {
                            this.nodesToMoveExist = true;
                        }, 4);
                    } else {
                        this.nodesToMoveExist = false;
                    };
                }
            }
        },

        methods: {
            // Добавление перемещаемой вершины в новое место
            nodeLocationPush(branch, node) {
                if (branch.children) {
                    if (branch.children.find(x => x.object.id === this.moveToOther.prop.object.id)) {
                        let index = branch.children.indexOf(this.moveToOther.prop);
                        branch.children[index].children.push(node);
                        // Обеспечение минимальной задержки для корректной обработки обращения к компоненту древа
                        setTimeout(() => {
                            this.toggleEditing(branch.children[index].children[branch.children[index].children.length - 1].object.id);
                        }, 4);
                        this.currentNode = node;
                    };
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.nodeLocationPush(branch.children[childrenVisited], node);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },

            // Исключение перемещаемой вершины из старого места
            nodeLocationRemove(branch, node) {
                if (branch.children) {
                    if (branch.children.find(x => x.object.id === node.object.id)) {
                        let index = branch.children.indexOf(node);
                        branch.children.splice(index, 1);
                        this.clearEditing();
                    };
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.nodeLocationRemove(branch.children[childrenVisited], node);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },

            // Перемещение активной вершины в выбранное новое место в science.nodes
            changeNodeLocation() {
                if(this.moveToOther.prop != 0) {
                    let tmpCurrentNode = this.currentNode;
                    this.science.nodes = this.nodeLocationRemove(this.science.nodes, this.currentNode);
                    this.science.nodes = this.nodeLocationPush(this.science.nodes, tmpCurrentNode);
                };
            },

            // Перемещение ноды вверх/вниз
            moveNode(branch, node, mode) {
                if (branch.children) {
                    if (branch.children.find(x => x.object.id === node.object.id)) {
                        let index = branch.children.indexOf(node);
                        if (mode === 'up') {
                            branch.children.splice(index - 1, 2, branch.children[index], branch.children[index - 1]);
                            this.clearEditing();
                            // Обеспечение минимальной задержки для корректной обработки обращения к компоненту древа
                            setTimeout(() => {
                                this.toggleEditing(branch.children[index - 1].object.id);
                            }, 4);
                            this.currentNode = node;
                        };
                        if (mode === 'down') {
                            branch.children.splice(index, 2, branch.children[index + 1], branch.children[index]);
                            this.clearEditing();
                            // Обеспечение минимальной задержки для корректной обработки обращения к компоненту древа
                            setTimeout(() => {
                                this.toggleEditing(branch.children[index + 1].object.id);
                            }, 4);
                            this.currentNode = node;
                        };
                    };
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.moveNode(branch.children[childrenVisited], node, mode);
                        childrenVisited += 1;
                    };
                };
                return branch;
            },

            // Перемещение ноды вверх/вниз в science.nodes
            nodeMove(mode) {
                if ((mode === 'up' && this.moveAccess.up) || (mode === 'down' && this.moveAccess.down)) {
                    this.science.nodes = this.moveNode(this.science.nodes, this.currentNode, mode);
                };
            },
            // Проверка наличия нод до/после активной в её слое для разрешения/запрета на перемещение вверх/вниз
            checkMoveAccess(branch, node) {
                if (!(this.science.nodes.object.id === node.object.id)) {
                    if (branch.children) {
                        if (branch.children.find(x => x.object.id === node.object.id)) {
                            let index = branch.children.indexOf(node);
                            if (index > 0) {
                                this.moveAccess.up = true;
                            };
                            if ((-1 < index) && (index < branch.children.length - 1)) {
                                this.moveAccess.down = true;
                            };
                        };                    
                        let branchLenght = branch.children.length;
                        let childrenVisited = 0;
                        while (branchLenght > childrenVisited) {
                            this.checkMoveAccess(branch.children[childrenVisited], node);
                            childrenVisited += 1;
                        };
                    };
                };
            },

            // Удаление ноды из science.nodes
            deleteNode() {
                this.science.nodes = this.deleteCurrentNode(this.science.nodes, this.currentNode);
            },

            // Удаление ноды
            deleteCurrentNode(branch, node) {
                if (branch.children) {
                    if (branch.children.find(x => x.object.id === node.object.id)) {
                        let index = branch.children.indexOf(node);
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

            // Удаление id, выданных временно (до сохранения) новым нодам (нужно для выдачи id сервером)
            deleteTmpIds(branch) {
                if (branch.object.id < -1) {
                    delete branch.object.id;
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.deleteTmpIds(branch.children[childrenVisited]);
                        childrenVisited += 1;
                    };
                };
                this.currentTmpId = -2;
                return branch;
            },

            // Выдача временный id (до сохранения) свежесозданной ноде
            giveTmpId(node) {
                node.object.id = this.currentTmpId;
                this.currentTmpId -= 1;
                return node;
            },

            // Добавление ноды
            addNode(mode) {
                let newNode = {
                    children: [],
                    object: {
                        id: 0,
                        name: "",
                        is_property: true
                    }
                };
                // Добавление свойства в корень
                if (mode === 'core' && this.newNodeName.core != "") {
                    newNode.object.name = this.newNodeName.core;
                    newNode = this.giveTmpId(newNode);
                    this.science.nodes.children.push(newNode);
                    this.newNodeName.core = "";
                };
                // Добавление ноды "под" активную
                if (mode === 'child' && this.newNodeName.child != "") {
                    if (this.currentNode.object.is_property) {
                        newNode.object.is_property = false;
                        newNode.object.tmp = "";
                        newNode.object.description = "";
                        newNode.object.content = "";
                    };
                    newNode.object.name = this.newNodeName.child;
                    newNode = this.giveTmpId(newNode);
                    this.currentNode.children.push(newNode);
                    this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                    this.newNodeName.child = "";
                };
                this.newNodeDetected = true;
            },

            // Определение готовности данных для передачи в блочный редуктор
            checkEditorState() {
                if (this.showContent && this.editingNode != -1 && this.treeDataReady) {
                    this.editDataReady = true;
                };
            },

            // Сохранение активной ноды в science.nodes
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

            // Поиск новой активной ноды в science.nodes
            nodeSearch(branch, id) {
                if (branch.object.id === id) {
                    this.currentNode = branch;
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    if ((branch.object.id != id) && (!branch.object.is_property) && (branchLenght > 0)) {
                        this.allNodes.push(branch);
                    };
                    while (branchLenght > childrenVisited) {
                        this.nodeSearch(branch.children[childrenVisited], id);
                        childrenVisited += 1;
                    };
                };
            },

            // Фиксация данных блочного редактора
            editorUpdated(content) {
                this.currentNode.object.content = content
            },

            ...mapMutations([
                'clearEditing',
                'toggleEditing'
            ]),

            // Получение данных с сервера (изначально)
            getData() {
      		    HTTP.get(`sciences/${ this.$route.params.id }/`)
                    .then(response => {
                        this.science = response.data;
                        //this.editDataReady = true;
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

            // Сохранение science.nodes на сервере
            saveTree() {
                if (this.currentNode.object.id != 0) {
                    this.science.nodes = this.nodeSaveToNodes(this.science.nodes, this.currentNode);
                };
                // Удаление временных id, если они есть
                if (this.newNodeDetected) {
                    this.science.nodes = this.deleteTmpIds(this.science.nodes);
                };
                HTTP.put(`sciences/${ this.$route.params.id }/upload_tree/`, this.science)
                    .then(response => {
                        // Обновление science.nodes лишь в случае, если были добавлены новые ноды
                        if (this.newNodeDetected) {
                            this.science.nodes = response.data.nodes;
                            this.newNodeDetected = false;
                        }
                        this.$notify({
                            group: 'foo',
                            type: "success",
                            title: 'Успешно сохранено',
                            text: 'Дисциплина загружена на сервер'
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
            this.clearEditing();
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
        width: 10%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .add-node-select {
        display: inline-block;
        width: 45%;
        vertical-align: middle;
        margin: 0;
    }

    .node {
        counter-reset: item;
        padding-left: 0;
    }

    .btn-move {
        border-radius: 3px;
        padding: 1px 7px;
        font-size: 14px;
        font-weight: 500;
        color: black;
        border: 1px solid white;
    }  
    
    .btn-move:hover {
        color: white;
    }

    .btns-vertical {
        display: inline-block;
        width: 10%;
        vertical-align: middle;
    }

    .btn-delete-node {
        display: inline-block;
        width: 25%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .node-delete-input {
        display: inline-block;
        width: 65%;
        vertical-align: middle;
    }
</style>
