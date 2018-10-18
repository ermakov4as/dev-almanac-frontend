<template type="text/x-template" id="item-template">
    <li>
        <div
                :class="{bold: isFolder}"
                @click="toggle"
                @dblclick="changeType">
        {{ model.name }}
        <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
        </div>
        <ul v-show="open" v-if="isFolder">
        <tree
            class="item"
            v-for="(model, index) in model.children"
                    :key="index"
                    :model="model">
        </tree>
        <li class="add" @click="addChild">+</li>
        </ul>
    </li>
</template>

<script>
    import Tree from './Tree.vue';

    export default {
        name: "tree",
        props: ['model'], 
        data() {
            return {
                open: false
            }
        },
        computed: {
            isFolder() {
                return this.model.children && this.model.children.length
                }
        },
        methods: {
            toggle() {
                if (this.isFolder) {
                    this.open = !this.open
                }
            },
            changeType() {
                if (!this.isFolder) {
                    Vue.set(this.model, 'children', [])
                    this.addChild()
                    this.open = true
                }
            },
            addChild() {
                this.model.children.push({
                    name: 'new stuff'
                })
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
</style>
