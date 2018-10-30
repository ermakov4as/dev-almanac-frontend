<template>
    <div class="block-container">
        <h1 class="component-title">Редактирование карточки "{{ card.name }}"</h1>
        <!--h2 class="component-subtitle">Урок {{ card.lesson }}  Дисциплина {{ card.science }}</h2-->
        <div class="component-content">
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
                                class="form-control save-cancel-input"
                                v-model="card.name">
                        <div
                                @click="saveCard"
                                class="btn btn-green btn-common save-cancel-btn"
                        >SAVE
                        </div>
                        <router-link
                                :to="`/sciences/${ card.science }/lessons/${ card.lesson }/`"
                                tag="button"
                                class="btn btn-red btn-common save-cancel-btn"
                        >CANCEL
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
                    <!-- Блок списка вершин урока с возможностью исключить и списка и добавить в него -->
                    <div class="col-8">
                        <div class="label-subtitle">
                            <label for="nodes">Вершины карточки</label>
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
                                            v-for="node in treeList"
                                            v-if="nodesSelected.indexOf(node) == -1"
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
                        <!-- Блок редактирования содержания карточки, блочный редактор -->
                        <div class="form-group">
                            <div class="label-subtitle">
                                <label for="content">Содержимое</label>
                                <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' :
                                    'Показать' }}</p>
                            </div>
                            <div class="form-element injected-content-place" v-if="showContent">
                                <button
                                        class="btn btn-orange btn-common btn-generate"
                                        >Сгенерировать из вершин</button>
                                <editor-block
                                        id="content"
                                        :articleOut="card.content"
                                        :dataReady="dataReady"
                                        @editorUpdated="editorUpdated"></editor-block>
                            </div>
                        </div>
                    </div>
                    <!-- Блок древа урока -->
                    <div class="col-4">
                        <div class="label-subtitle">
                            <label for="tree">Дерево урока</label>
                        </div>
                        <div class="form-element nodes-place tree-place">
                            <!-- ТЕСТ СПИСКА ВЕРШИН ДРЕВА -->
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
                <!-- Блок редактирования времени на изучение карточки -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="time">Время на изучение
                            <span class="label-subdescription">   (в секундах)</span>
                        </label>
                    </div>
                    <div class="form-element">
                        <input
                                type="number"
                                min="0"
                                id="time"
                                class="form-control time-input"
                                v-model="card.time">
                    </div>
                </div>
            </form>
            <!-- Блок тренажёров карточек -->
            <div class="form-group elements-list-margin">
                <div class="label-subtitle">
                    <label for="cards">Тренажёры: </label>
                    <p @click="showTrainer = !showTrainer" class="show-element elements-list-margin">
                        {{ showTrainer ? 'Скрыть' : 'Показать' }}
                    </p>
                </div>
            </div>
            <h3 v-if="showTrainer">Здесь будут тренажёры карточек...</h3>
            <!--name-desc-list
                    v-if="showTrainer"
                    v-for="(card, index) in lesson.cards"
                    :key="card.id"
                    id="cards"
                    :index="index"
                    :element="card"
                    :delProps="delProps"
                    @elementRemoved="elementRemoved"></name-desc-list-->
            <div class="create-btn-right">
                <!-- Кнопка создания нового тренажёра карточки -->
                <div
                        @click="createNewTrainer"
                        class="btn btn-green btn-oval create-btn">Добавить тренажёр</div>
            </div>
        </div>
    </div>
</template>

<script>
    import EditorBlock from '../components/Elements/EditorBlock.vue';
    import NodesDelList from '../components/Elements/NodesDelList.vue';
    import TreeRegister from '../components/CardEditor/TreeRegister.vue';
    import {HTTP} from '../http-common.js';
    import {mapMutations, mapGetters} from 'vuex';

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
                    time: 0
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
                showContent: false,
                showTrainer: false,
                treeStartReady: false,
                treeDataReady: 0,
            };
        },
        components: {
            //CreateBtn,
            //NameDescList,
            EditorBlock,
            NodesDelList,
            TreeRegister
        },
        computed: {
            ...mapGetters([
                'nodesSelected'
            ])
        },
        watch: {
            treeDataReady: {
                handler(val, oldVal) {
                    if (this.treeDataReady == 2) {
                        this.treeStartReady = true;
                        if (this.lessonTreeData.length > 0) {
                            this.treeNodesToBuild(this.scienceTreeData, this.lessonTreeData.map(x => x.id));
                        };
                        this.treeDataReady = 0;
                    };
                }
            }
        },
        methods: {
            createNewTrainer() {}, ///////////////////////////////////////////////////////////////////////////////////
            treeNodesToBuild(branch, storage) {
                if (storage.indexOf(branch.object.id) != -1) {
                    this.treeList.push(branch.object);
                };
                if (branch.children) {
                    let branchLenght = branch.children.length;
                    let childrenVisited = 0;
                    while (branchLenght > childrenVisited) {
                        this.treeNodesToBuild(branch.children[childrenVisited], storage);
                        childrenVisited += 1;
                    };
                };
            },
            /*cardTimeCorrect() {
                let hours = Math.floor(this.card.time / 60 / 60 % 60).toString();
                let minutes = Math.floor(this.card.time / 60 % 60).toString();
                this.card.time = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
            },*/
            editorUpdated(content) {
                this.card.content = content
            },
            addNodeToLesson() {
                console.log(this.nodeAdding);
                console.log(this.treeList);
                if (this.nodeAdding != 0) {
                    let currentNode = this.treeList.find(x => x.id === this.nodeAdding); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    this.nodeAdding = 0;
                    this.toggleNode(currentNode);
                    this.changeNodeSelection(currentNode.id);
                };
            },
            nodeRemoved(index, node) {
                this.toggleNode(node)
                this.changeNodeSelection(node.id)
            },
            ...mapMutations([
                'clearState',
                'toggleNode',
                'changeNodeSelection',
                'initNodes'
            ]),
            saveCard() {
                this.card.nodes = this.nodesSelected;
                this.card.time = parseInt(this.card.time);
                console.log(typeof(this.card.time));
                console.log(this.card);
                HTTP.put(`cards/${ this.$route.params.id }/`, this.card)
                    .then(response => {
                        alert('Сохранено!');
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
            getData() {
                HTTP.get(`cards/${ this.$route.params.id }/`)
                    .then(response => {
                        console.log('response_data_check');
                        console.log(response.data);
                        this.card = response.data;
                        //this.cardTimeCorrect();
                        this.dataReady = true;
                        this.initNodes(this.card.nodes);
                        HTTP.get(`sciences/${ this.card.science }/`)
                            .then(response => {
                                this.scienceTreeData = response.data.nodes;
                                this.treeDataReady += 1;
                                //console.log(this.scienceTreeData);
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
                        HTTP.get(`lessons/${ this.card.lesson }/`)
                            .then(response => {
                                this.lessonTreeData = response.data.nodes;
                                this.treeDataReady += 1;
                                //console.log(this.lessonTreeData);
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
</style>
