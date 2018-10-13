<template>
    <div class="element-table">
        <div class="name-node-line">
	        <h5 class="node-name">{{ node.name }}</h5>
            <button
                    @click="deleteNode"
                    class="btn btn-red btn-common remove-btn"
                    >X</button>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'node',
            'index',
        ],
        methods: {
            deleteNode() {
                if (confirm(`Удалить вершину?`)) {
                    this.$emit('nodeRemoved', this.index);
                }
            }
        }
    }
</script>

<style scoped>
    p {
        margin: 0;
    }

    .element-table {
        margin: 0 0 -1px 0;
    }

    .desc-label {
        border: 1px solid gray;
        margin-top: -1px;
        vertical-align: middle;
        font-size: 14px;
        text-align: start;
        padding-left: 10px;
        padding-right: 10px;
        min-height: 30px;
    }

    .name-node-line {
        text-align: center;
        border: 1px solid gray;
        padding: 0;
    }

    .name-node-line:before {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .remove-btn {
        display: inline-block;
        width: 10%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .node-name {
        display: inline-block;
        width: 90%;
        vertical-align: middle;
        margin: 0;
    }
</style>