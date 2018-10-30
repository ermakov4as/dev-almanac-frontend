<template type="text/x-template" id="item-template">
    <li>
        <span
                class="btn-tree btn-tree-node"
                :class="{selected: isSelected}"
                @click="toggle(node)">
            {{ node.name }}
        </span>
    </li>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex';

    export default {
        name: "tree-list",
        props: [
            'node',
            'ready'
        ],
        data() {
            return {
                isSelected: false,
                firstNodesGetting: true
            };
        },
        computed: {
            ...mapGetters([
                'nodeSelected'
            ])
        },
        methods: {
            /*initSelestedNodes() {
                console.log('1st - test');
                console.log(this.nodesSelected);
                console.log(this.node.object.id);
                if (this.nodesSelected.find(x => x.id === this.node.object.id)) {
                    this.isSelected = !this.isSelected;
                };
            },*/
            toggle(node) {
                this.toggleNode(node);
                this.isSelected = !this.isSelected
            },
            ...mapMutations([
                'toggleNode',
                'changeNodeSelection'
            ]),
        },
        watch: {
            nodeSelected: {
                handler(val, oldVal) {
                    if (this.nodeSelected == this.node.id) {
                        this.isSelected = !this.isSelected
                        this.changeNodeSelection(-1)
                    }
                }
            }/*,
            ready: {
                handler(val, oldVal) {
                    if (this.firstNodesGetting) {
                        this.initSelestedNodes();
                        console.log('1st');
                        this.firstNodesGetting = false;
                    };
                    console.log('ready...ready...');
                }
            }*/
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
