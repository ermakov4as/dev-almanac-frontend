<template>
    <div class="block-container">
        <h1 class="component-title">Дисциплина {{ science.id }}</h1>
        <div class="component-content">
                <!-- Разделённая на 2 колонки часть -->
                <div class="row form-group multi-cols-border">
                    <!-- Блок древа урока -->
                    <div class="col-4 border-right bottom-imitate">
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
                    <div class="col-8 bottom-imitate">

                    </div>
                </div>
        </div>
    </div>
</template>

<script>
    import TreeEdit from '../components/DiscTree/TreeEdit.vue';
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
                treeDataReady: false
            };
        },
        components: {
            TreeEdit
        },
        computed: {
            ...mapGetters([
                'editingNode'
            ])
        },
        methods: {
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
        },
        created() {
            this.clearEditing();
            this.getData();
        }
    }
</script>

<style scoped>

</style>
