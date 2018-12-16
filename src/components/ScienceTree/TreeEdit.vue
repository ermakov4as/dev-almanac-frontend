<template type="text/x-template" id="item-template">
    <li :class="{'node-item': !node.object.is_property}">

        <!-- Отображаем ноду как элемент древа -->
        <span
                class="btn-tree btn-tree-node"
                v-if="node.object.id"
                :class="{property: node.object.is_property,  selected: isSelected}"
                @click="toggleEditing(node.object.id)">
            {{ node.object.name }}
        </span>

        <ol :class="{'node': !node.object.is_property}">
            
            <!-- Блок дочерних нод -->
            <tree-edit
                    class="item"
                    v-for="(node, index) in node.children"
                    :key="index"
                    :node="node">
            </tree-edit>

        </ol>
    </li>
</template>

<script>
    import Tree from './TreeEdit.vue'
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: "tree-edit",
        props: ['node'],

        data() {
            return {
                open: false,
                isSelected: false
            }
        },

        computed: {
            ...mapGetters([
                'editingNode'
            ])
        },

        methods: {
            ...mapMutations([
                'toggleEditing'
            ])
        },

        watch: {
            // Отслеживаем изменение редактируемой ноды и, в соответствии с этим, меняем выделенную
            editingNode: {
                handler(val, oldVal) {
                    if (this.editingNode === this.node.object.id) {
                        this.isSelected = true;
                    } else {
                        this.isSelected = false;
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
