<template type="text/x-template" id="item-template">
    <li>

        <!-- Отображаем ноду как элемент списка нод -->
        <span
                class="btn-tree btn-tree-node"
                :class="{selected: isSelected}"
                @click="toggle(node)">
            {{ node.name }}
        </span>

    </li>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: "tree-register",
        props: ['node', 'ready'],
        
        data() {
            return {
                isSelected: false,
                firstNodesGetting: true
            };
        },

        computed: {
            ...mapGetters([
                'nodeSelected',
                'nodesSelected'
            ])
        },

        methods: {
            // Поиск и выделение выбранной ноды
            initSelestedNode() {                
                if (this.nodesSelected.find(x => x.id === this.node.id)) {
                    this.isSelected = true;
                }
            },

            // Выбор (отмена выбора) ноды
            toggle(node) {
                this.toggleNode(node);
                this.isSelected = !this.isSelected
            },

            ...mapMutations([
                'toggleNode',
                'changeNodeSelection'
            ])
        },

        watch: {
            // Отслеживание изменений списка выбранных нод
            nodeSelected: {
                handler(val, oldVal) {
                    if (this.nodeSelected == this.node.id) {
                        this.isSelected = !this.isSelected
                        this.changeNodeSelection(-1)
                    }
                }
            },

            // Отслеживание готовности данных
            ready: {
                handler(val, oldVal) {
                    if (this.ready) {
                        if (this.firstNodesGetting) {
                            this.initSelestedNode();
                            this.firstNodesGetting = false;
                        }
                    }
                }
            }
        },

        created() {
            if (this.ready) {
                if (this.firstNodesGetting) {
                    this.initSelestedNode();
                    this.firstNodesGetting = false;
                }
            }
        }
    }
</script>

<style scoped>
    body {
        font-family: Menlo, Consolas, monospace;
        color: #444;
    }

    .item {
        cursor: pointer;
    }

    .bold {
        font-weight: bold;
    }

    ul {
        padding-left: 1em;
        line-height: 1.5em;
        list-style-type: dot;
    }

    .node {
        counter-reset: item;
        padding-left: 2rem;
    }

    li {
        display: block;
    }

    .node-item:before {
        content: counters(item, ".") ". ";
        counter-increment: item
    }

    .property {
        text-decoration: underline;
    }

    .selected {
        background-color: lightgreen;
        border-color: black
    }
</style>
