<template type="text/x-template" id="item-template">
    <li :class="{'node-item': !node.is_property}">
        <span
                class="btn-tree btn-tree-node"
                :class="{property: node.is_property,  selected: isSelected}"
                @click="toggle(node)">
        {{ node.name }}
        </span>
        <ol :class="{'node': !node.is_property}">
            <tree
                    class="item"
                    v-for="(node, index) in node.children"
                    :key="index"
                    :node="node">
            </tree>
        </ol>
    </li>
</template>

<script>
    import Tree from './Tree.vue';
    import {mapMutations} from 'vuex';

    export default {
        name: "tree",
        props: ['node'],
        data() {
            return {
                open: false,
                isSelected: false
            }
        },
        methods: {
            toggle(node) {
                if (!this.node.is_property) {
                    this.toggleNode(node);
                    this.isSelected = !this.isSelected
                }
            },
            ...mapMutations([
                'toggleNode'
            ]),
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
