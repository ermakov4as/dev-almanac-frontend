<template type="text/x-template" id="item-template">
    <li>
        <div>
            <button
                    class="btn-tree btn-tree-node"
                    :class="{bold: isFolder, chozen: isChozen}"
                    @click="/*toggle*/nodeChozen(model)">
                    <!-- @dblclick="changeType" -->
            {{ model.name }}
            </button>
            <button 
                    v-if="isFolder" 
                    @click="toggle"
                    class="btn-tree btn-tree-open"
                    :class="{bold: isFolder, openned: open}">
            {{ open ? '-' : '+' }}</button>
        </div>
        <ul v-show="open" v-if="isFolder">
            <tree
                class="item"
                v-for="(model, index) in model.children"
                        :key="index"
                        :model="model">
            </tree>
        </ul>
    </li>
</template>

<script>
    import Tree from './Tree.vue';
    import { mapMutations } from 'vuex';

    export default {
        name: "tree",
        props: ['model'], 
        data() {
            return {
                open: false,
                isChozen: false
            }
        },
        computed: {
            isFolder() {
                return this.model.children && this.model.children.length
                }
        },
        methods: {
            nodeChozen(node) {
                this.addNode(node)
                this.isChozen = !this.isChozen
            },
            ...mapMutations([
                'addNode'
            ]),
            toggle() {
                if (this.isFolder) {
                    this.open = !this.open
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
    .btn-tree {
        border: 1px solid inherit;
        background-color: inherit;
        padding: 3px 18px;
        color: black;
        cursor: pointer;
    }
    .btn-tree-node {
        min-width: 50%;
    }
    .btn-tree-open {
        margin-left: 10px;
    }
    .chozen {
        background-color: lawngreen;
        border-color: black
    }
    .openned {
        background-color: aqua;
        border-color: black;
    }
</style>
