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
                        <button
                                @click="saveLesson"
                                class="btn btn-green btn-common save-cancel-btn"
                                >SAVE</button>
                        <router-link
                                :to="`/sciences/${ lesson.science }/`"
                                tag="button"
                                class="btn btn-red btn-common save-cancel-btn"
                                >CANCEL</router-link>
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
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' : 'Показать' }}</p>
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
                                v-for="(node, index) in lesson.nodes"
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
                                        v-for="node in nodesSelected"
                                        v-if="notInList(node.id)" 
                                        :value="node.id"
                                        :key="node.id">{{ node.name }}</option>
                            </select>
                            <button
                                    class="btn btn-green btn-common save-cancel-btn add-node-btn"
                                    @click="addNodeToLesson">Добавить</button>
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
                        <ul id="demo">
                            <tree
                                class="item"
                                :model="treeData">
                            </tree>
                        </ul>

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
    import Tree from '../components/Elements/Tree.vue';
    import { HTTP } from '../http-common.js';
    import { mapMutations, mapGetters } from 'vuex';

    export default {
        data() {
            return {
                // ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ДРЕВА
                treeData: {
                    id: 100,
                    name: 'My Tree',
                    children: [
                        { name: 'hello', id: 101 },
                        { name: 'wat', id: 102 },
                        {
                        name: 'child folder',
                        id: 103,
                        children: [
                            {
                            name: 'child folder',
                            id: 104,
                            children: [
                                { name: 'hello', id: 105 },
                                { name: 'wat', id: 106 }
                            ]
                            },
                            { name: 'hello', id: 107 },
                            { name: 'wat', id: 108 },
                            {
                            name: 'child folder',
                            id: 109,
                            children: [
                                { name: 'hello', id: 110 },
                                { name: 'wat', id: 111, }
                            ]
                            }
                        ]
                        }
                    ]
                },
                idInList: [],
                nodeAdding: {
                    id: 0,
                    name: ''
                },
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
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
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
        methods: {
            notInList(id) {
                if (this.idInList.indexOf(id) == -1) {
                    return true
                } else {
                    return false
                }
                console.log()
            },
            addNodeToLesson() {
                //console.log(this.nodeAdding)
                let currentNode = this.nodesSelected.find(x => x.id === this.nodeAdding) //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                //console.log(currentNode)
                this.lesson.nodes.push(currentNode)
                this.idInList.push(currentNode.id)
            },
            ...mapMutations([
                'clearState',
                'addNode'
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
            nodeRemoved(index, id) {
                this.lesson.nodes.splice(index, 1)
                let idIndex = this.idInList.indexOf(id)
                this.idInList.splice(idIndex, 1)
            },
            // Получение данных с сервера (изначально)
            getData() {
      		    HTTP.get(`lessons/${ this.$route.params.id }/`)
                    .then(response => {
                        this.lesson = response.data;
                        this.dataReady = true;
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
            },
        },
        created() {
            this.getData();
            this.clearState();
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
</style>