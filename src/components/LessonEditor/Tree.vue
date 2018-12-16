<template type="text/x-template" id="item-template">
    <li :class="{'node-item': !node.object.is_property}">
        
        <!-- Отображаем ноду как элемент древа -->
        <span
                class="btn-tree btn-tree-node"
                :class="{property: node.object.is_property,  selected: isSelected}"
                @click="toggle(node)">
            {{ node.object.name }}
        </span>

        <ol :class="{'node': !node.object.is_property}">
            
            <!-- Блок дочерних нод -->
            <tree
                    class="item"
                    v-for="(node, index) in node.children"
                    :key="index"
                    :ready="readyChild"
                    :node="node">
            </tree>

        </ol>
    </li>
</template>

<script>
    import Tree from './Tree.vue'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: "tree",
        props: [
            'node', 
            'ready'
        ],

        data() {
            return {
                open: false,
                isSelected: false,
                firstNodesGetting: true,
                readyChild: false
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
                if (this.nodesSelected.find(x => x.id === this.node.object.id)) {
                    this.isSelected = !this.isSelected;
                }
            },

            // Выбор (отмена выбора) ноды
            toggle(node) {
                if (!this.node.object.is_property) {
                    this.toggleNode(node.object);
                    this.isSelected = !this.isSelected
                }
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
                    if (this.nodeSelected == this.node.object.id) {
                        this.isSelected = !this.isSelected;
                        this.changeNodeSelection(-1);
                    }
                }
            },

            // Отслеживание готовности данных
            ready: {
                handler(val, oldVal) {
                    if (this.firstNodesGetting) {
                        this.initSelestedNode();
                        this.firstNodesGetting = false;
                        setTimeout(() => {
                            this.readyChild = true;
                        }, 4);
                    }
                }
            }
        },

        components: {
            Tree
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
        display: block
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
