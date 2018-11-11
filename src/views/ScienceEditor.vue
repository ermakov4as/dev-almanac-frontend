<template>
    <div>
        <h1 class="component-title">Редактирование дисциплины "{{ science.name }}"</h1>
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
                                class="form-control save-cancel-input mr-1"
                                v-model="science.name">
                        <div @click="saveScience" class="btn btn-success mr-1">Сохранить</div>
                        <router-link to="/sciences/" tag="button"
                                     class="btn btn-danger">Отмена
                        </router-link>
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
                        <p @click="showContent = !showContent" class="show-element">{{ showContent ? 'Скрыть' :
                            'Показать' }}</p>
                    </div>
                    <div class="form-element-complex" v-if="showContent">
                        <editor-block
                                id="content"
                                :articleOut="science.content"
                                :dataReady="dataReady"
                                @editorUpdated="editorUpdated"></editor-block>
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
            <items-list-editor v-model="science.lessons" :props="delProps"></items-list-editor>

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
    import NodesDelList from '../components/Elements/NodesDelList.vue';
    import EditorBlock from '../components/Elements/EditorBlock.vue';
    import ItemsListEditor from "../components/Elements/ItemsListEditor"
    import {HTTP} from '../http-common.js';

    export default {
        name: 'ScienceEditor',
        components: {
            CreateBtn,
            NodesDelList,
            EditorBlock,
            ItemsListEditor
        },
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
                dataReady: false,
                showContent: true,
                showLessons: true,
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
                            [{'list': 'ordered'}, {'list': 'bullet'}],
                            [{'font': []}],
                            [{'color': []}, {'background': []}],
                            [{'align': []}],
                        ]
                    }
                }
            }
        },

        methods: {
            // Функции-обработчики действий из дочерних компонентов
            editorUpdated(content) {
                this.science.content = content
            },

            // Добавление урока в список уроков
            createBtnUsed(newLesson) {
                this.science.lessons.push(newLesson)
            },

            // Удаление урока из списка уроков
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
            }
        },

        created() {
            this.getData();
        }
    }
</script>