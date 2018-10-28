<template type="text/x-template" id="item-template">
    <li :class="{'node-item': !node.object.is_property}">
        <span
                class="btn-tree btn-tree-node"
                :class="{property: node.object.is_property,  selected: isSelected}"
                @click="toggle(node)">
            {{ node.object.name }}
        </span>
        <ol :class="{'node': !node.object.is_property}">
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
    import Tree from './TreeEdit.vue';
    import {mapMutations, mapGetters} from 'vuex';

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
            toggle(node) {
                /*if (!this.node.object.is_property) {*/
                this.toggleEditing(node.object.id);
                //this.isSelected = !this.isSelected
                /*}*/
            },
            ...mapMutations([
                'toggleEditing'
            ]),
        },
        /*watch: {
            nodeSelected: {
                handler(val, oldVal) {
                    if (this.nodeSelected == this.node.object.id) {
                        this.isSelected = !this.isSelected
                        this.changeNodeSelection(-1)
                    }
                }
            }
        },*/
        watch: {
            editingNode: {
                handler(val, oldVal) {
                    if (this.editingNode === this.node.object.id) {
                        this.isSelected = true;
                    } else {
                        this.isSelected = false;
                    };
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
