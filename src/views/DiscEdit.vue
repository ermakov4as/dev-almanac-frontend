<template>
    <div class="block-container">
        <h1 class="component-title">Редактирование дисциплины</h1>
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
                                v-model="science.name">
                        <button
                                @click="saveScience"
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
                        <label for="desc">Описание</label>
                    </div>
                    <div class="form-element">
                        <app-editor-simple
                                id="desc"
                                :contentForQuil="science.desc"
                                @quilUpdated="quilUpdatedDesc"></app-editor-simple>
                    </div>
                </div>
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="content">Содержимое</label>
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' : 'Показать' }}</p>
                    </div>
                    <div class="form-element" v-if="showContent">
                        <app-editor-top
                                id="content"
                                :requestPath="requestPath"></app-editor-top>
                    </div>
                </div>
            </form>
            <div class="form-group lessons-list-margin">
                <div class="label-subtitle">
                    <label for="lessons">Список уроков</label>
                    <p @click="showLessons = !showLessons" class="show-element lessons-list-margin">{{ showLessons ? 'Скрыть' : 'Показать' }}</p>
                </div>
            </div>
            <app-name-desc-list
                    v-if="showLessons"
                    v-for="lesson in science.lessons"
                    :key="lesson.id"
                    id="lessons"
                    :element="lesson"
                    :editPath="editPath"></app-name-desc-list>
            <div class="create-btn-right">
                <app-create-btn :createBtn="createBtn"></app-create-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import NameDescList from '../components/Elements/NameDescList.vue';
    import EditorSimple from '../components/Elements/EditorSimple.vue';
    import EditorTop from '../components/Elements/EditorTop.vue';
    import axios from 'axios';

    export default {
        data() {
            return {
                createBtn: {
                    name: 'НОВЫЙ УРОК',
                    btnPath: `/sciences/${ this.$route.params.id }/lesson/0/edit`
                },
                science: {
                    id: -2,
                    name: "",
                    desc: "",
                    content: "",
                    video: "",
                    lessons: [{
                        id: -3,
                        name: "",
                        desc: ""
                    }]
                },
                cancelLink: { path: '/sciences' },
                editPath: `/sciences/${ this.$route.params.id }/lesson/`,
                requestPath: '/articles/',
                showContent: false,
                showLessons: false,
                vremNewId: 100
            }
        },
        components: {
            appCreateBtn: CreateBtn,
            appNameDescList: NameDescList,
            appEditorSimple: EditorSimple,
            appEditorTop: EditorTop
        },
        methods: {
            /*quilUpdatedContent(content) {
                this.science.content = content
            },*/
            quilUpdatedDesc(desc) {
                this.science.desc = desc
            },
            getData() {
      		    axios
                    .get(`sciences/${ this.$route.params.id }/edit`)
                    .then(response => {
                        this.science = response.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            saveScience() {
                if (this.$route.params.id == 0) {
                    axios
                        .post(`sciences/${ this.vremNewId }/edit`, this.science)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    axios
                        .put(`sciences/${ this.$route.params.id }/edit`, this.science)
                        .then(response => {
                            console.log(response.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            }
        },
        mounted() {
    	    this.getData();
        }
    }
</script>

<style scoped>
    .lessons-list-margin {
        margin-bottom: 0;
    }
</style>
