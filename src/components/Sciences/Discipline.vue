<template>
    <div class="discipline">

        <!-- Слева располагаем название дисциплины -->
        <div class="disc-float-left">
	        <h3>{{ discipline.name }}</h3>
        </div>

        <!-- Справа располагаем кнопки -->
        <div class="disc-float-right">

            <!--Переход на страницу редактирования древа этой дисциплины -->
            <router-link
                    :to="discTreeLink"
                    tag="button"
                    class="btn btn-green btn-common disc-btn"
                    >ДРЕВО</router-link>

            <!-- Переход на страницу редактирования этой дисциплины-->
            <router-link
                    :to="editDiscLink"
                    tag="button"
                    class="btn btn-orange btn-common disc-btn"
                    >РЕДАКТИРОВАТЬ</router-link>

            <!-- УДАЛЕНИЕ ДИСЦИПЛИНЫ. КНОПКА ДЛЯ ОТЛАДКИ. ПРИ НЕОБХОДИМОСТИ РАСКОММЕНТИТЬ ЗДЕСЬ И В ЧАСТИ JS.-->
            <!--
            <button
                    @click.prevent="deleteScience"
                    class="btn btn-red btn-common disc-btn"
                    >X</button>
                    -->
        </div>

    </div>
</template>

<script>
    import { HTTP } from '../../http-common.js';

    export default {
        data() {
            return {
                discTreeLink: {
                    path: `/sciences/${ this.discipline.id }/upload_tree/`,
                    params: { id: this.discipline.id }
                },
                editDiscLink: {
                    path: `/sciences/${ this.discipline.id }/`,
                    params: { id: this.discipline.id }
                }
            }
        },

        props: [
            'discipline',
            'index'
        ],

        methods: {
            // УДАЛЕНИЕ ДИСЦИПЛИНЫ. КНОПКА ДЛЯ ОТЛАДКИ. ПРИ НЕОБХОДИМОСТИ ИСПОЛЬЗОВАНИЯ - РАСКОММЕНТИТЬ ЗДЕСЬ И В ЧАСТИ HTML.
            /*deleteScience() {
                if (confirm(`Удалить дисциплину (опция доступна только на этапе отладки)?`)) {
                     HTTP.delete('editor/sciences/' + this.discipline.id)
                        .then((response) => {
                            this.$notify({
                                group: 'foo',
                                type: "success",
                                title: 'Успешно удалено',
                                text: 'Дисциплина удалена с сервера'
                            });

                            // Возврат родителю информации о том, какой (по порядку) элемент был удалён
                            this.$emit('scienceRemoved', this.index);

                        })
                        .catch((error) => {
                            console.log(error)
                        })
                };
            }*/
        }
    }
</script>

<style scoped>
    .discipline {
        height: 70px;
        vertical-align: middle;
        cursor: pointer;
    }

    .discipline:hover {
        background-color: whitesmoke;
    }

    .disc-float-left {
        padding: 5px 30px;
        float: left;
        max-width: 70%
    }

    .disc-float-right {
        padding: 5px 30px;
        float: right;
    }

    h3 {
        height: 100%;
        vertical-align: middle;
        margin-top: 10px;
    }

    .disc-btn {
        margin-top: 12px;
        margin-left: 10px;
    }
</style>
