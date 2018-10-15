<template>
    <div class="block-container">
        <h1 class="component-title">Редактирование урока {{ lesson.id }}</h1>
        <h2 class="component-subtitle">Дисциплина {{ lesson.science }}</h2>
        <div class="component-content">
            <form>
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
                                :to="cancelLink"
                                tag="button"
                                class="btn btn-red btn-common save-cancel-btn"
                                >CANCEL</router-link>
                    </div>
                </div>
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="description">Описание</label>
                    </div>
                    <div class="form-element">
                        <editor-simple
                                id="description"
                                :contentForQuil="lesson.description"
                                :dataReady="dataReady"
                                @quilUpdated="quilUpdatedDesc"></editor-simple>
                    </div>
                </div>
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="content">Содержимое</label>
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' : 'Показать' }}</p>
                    </div>
                    <div class="form-element" v-if="showContent">
                        <editor-top
                                id="content"
                                :articleOut="lesson.content"
                                :dataReady="dataReady"></editor-top>
                    </div>
                </div>
            </form>
            <div class="row form-group multi-cols-border">
                <div class="col-6">
                    <div class="label-subtitle">
                        <label for="nodes">Вершины урока</label>
                    </div>
                    <div class="form-element nodes-place">
                        <nodes-del-list
                                v-for="(node, index) in lesson.nodes"
                                :key="node.id"
                                id="nodes"
                                :index="index"
                                :node="node"
                                @nodeRemoved="nodeRemoved"></nodes-del-list>
                        <div class="add-node-line">
                            <select
                                    id=""
                                    class="form-control add-node-select"
                                    v-model="nodeAdding">
                                <option 
                                        v-for="node in nodesSelected" 
                                        :key="node.id">{{ node.name }}</option>
                            </select>
                            <button
                                    class="btn btn-green btn-common save-cancel-btn add-node-btn">Добавить</button>
                        </div>
                    </div>
                </div>
                <div class="col-6">
                    <div class="label-subtitle">
                        <label for="tree">Дерево дисциплины</label>
                    </div>
                    <div class="form-element nodes-place">
                        <p>tree....</p>
                    </div>
                </div>
            </div>
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
    import EditorSimple from '../components/Elements/EditorSimple.vue';
    import EditorTop from '../components/Elements/EditorTop.vue';
    import NodesDelList from '../components/Elements/NodesDelList.vue';
    import { HTTP } from '../http-common.js';

    export default {
        data() {
            return {
                nodesSelected: [],
                nodeAdding: {},
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
                cancelLink: { path: `/sciences/${ this.$route.params.id }/` },
                dataReady: false,
                showContent: true,
                showCards: false,
                scienceName: this.$route.params.futureName,
                delProps: {
                    name: 'карточку',
                    editPath: `${ this.$route.path }cards/`,
                    delLink: 'cards/'
                }
            }
        },
        components: {
            CreateBtn,
            NameDescList,
            EditorSimple,
            EditorTop,
            NodesDelList
        },
        methods: {
            createBtnUsed(newCard) {
                this.lesson.cards.push(newCard)
            },
            quilUpdatedDesc(desc) {
                this.lesson.description = desc
            },
            elementRemoved(index) {
                this.lesson.cards.splice(index, 1)
            },
            nodeRemoved(index) {
                this.lesson.nodes.splice(index, 1)
            },
            getData() {
      		    HTTP.get(`lessons/${ this.$route.params.id }/`)
                    .then(response => {
                        this.lesson = response.data;
                        //this.science.content = {}; // IT IS ONLY FOR TESTING W/OUT SCIENCE.CONTENT AS AN OBJECT FROM SERVER !!!
                        this.dataReady = true;
                        console.log('GET LessonEdit');
                        console.log(response.data);
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
            saveLesson() {
                HTTP.put(`lessons/${ this.$route.params.id }/`, this.lesson)
                    .then(response => {
                        console.log(response.data);
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
            //console.log(this.$route.params);
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