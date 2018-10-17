<template>
    <div class="block-container">
        <h1 class="component-title">Редактирование дисциплины {{ science.id }}</h1>
        <div class="component-content">
            <form>
                <!-- Блок редактирования названия дисциплины, кнопок сохранить на сервере и вернуться назад -->
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
                <!-- Блок редактирования описания дисциплины, редактор Quill -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="description">Описание</label>
                    </div>
                    <div class="form-element">
                        <quill-editor 
                                v-model="science.description"
                                :options="customToolbar"></quill-editor>
                    </div>
                </div>
                <!-- Блок редактирования содержания дисциплины, блочный редактор -->
                <div class="form-group">
                    <div class="label-subtitle">
                        <label for="content">Содержимое</label>
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' : 'Показать' }}</p>
                    </div>
                    <div class="form-element-complex" v-if="showContent">
                        <editor-top
                                id="content"
                                :articleOut="science.content"
                                :dataReady="dataReady"
                                @editorUpdated="editorUpdated"></editor-top>
                    </div>
                </div>
            </form>
            <!-- Блок списка уроков -->
            <div class="form-group elements-list-margin">
                <div class="label-subtitle">
                    <label for="lessons">Уроки: </label>
                    <p @click="showLessons = !showLessons" class="show-element elements-list-margin">
                        {{ showLessons ? 'Скрыть' : 'Показать' }}
                    </p>
                </div>
            </div>
            <name-desc-list
                    v-if="showLessons"
                    v-for="(lesson, index) in science.lessons"
                    :key="lesson.id"
                    id="lessons"
                    :index="index"
                    :element="lesson"
                    :delProps="delProps"
                    @elementRemoved="elementRemoved"></name-desc-list>
            <!-- Кнопка создания нового урока -->
            <div class="create-btn-right">
                <create-btn 
                        :createBtn="createBtn" 
                        :requestId="{'science_id': science.id}"
                        @createBtnUsed="createBtnUsed"></create-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import CreateBtn from '../components/Elements/CreateBtn.vue';
    import NameDescList from '../components/Elements/NameDescList.vue';
    import EditorTop from '../components/Elements/EditorTop.vue';
    import { HTTP } from '../http-common.js';

    export default {
        data() {
            return {
                science: {
                    id: 0,
                    name: "",
                    description: "",
                    content: "",
                    lessons: [{
                        id: 0,
                        name: "",
                        description: ""
                    }]
                },
                createBtn: {
                    name: 'ДОБАВИТЬ УРОК',
                    btnPath: `${ this.$route.path }lessons/`,
                    requestPath: 'lessons/'
                },
                cancelLink: { path: '/sciences/' },
                dataReady: false,
                showContent: true,
                showLessons: false,
                delProps: {
                    name: 'урок',
                    editPath: `${ this.$route.path }lessons/`,
                    delLink: 'lessons/'
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
            EditorTop,
        },
        methods: {
            // Функции-обработчики действий из дочерних компонентов
            editorUpdated(content) {
                this.science.content = content
            },
            createBtnUsed(newLesson) {
                this.science.lessons.push(newLesson)
            },
            elementRemoved(index) {
                this.science.lessons.splice(index, 1)
            },
            // Получение данных с сервера (изначально)
            getData() {
      		    HTTP.get(`sciences/${ this.$route.params.id }/`)
                    .then(response => {
                        this.science = response.data;
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
            saveScience() {
                HTTP.put(`sciences/${ this.$route.params.id }/`, this.science)
                    .then(response => {
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
            },
        },
        created() {
            this.getData();
        }
    }
</script>

<style scoped>

</style>
