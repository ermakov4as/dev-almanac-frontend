<template>
    <div class="element-table">
        <div class="name-node-line">
            <!-- Название вершины -->
	        <h5 class="node-name">{{ node.name }}</h5>
            <!-- Кнопка удаления вершины из списка используемых в родительском компоненте -->
            <div
                    @click="deleteNode"
                    class="btn btn-red btn-common remove-btn"
                    >X</div>
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
            // Удаляет вершину, но не с сервера и не из дерева, а только из списка используемых в данном додительском компоненте вершин
            deleteNode() {
                // Возврат родителю информации о том, какая (по порядку) вершина удалена
                this.$emit('nodeRemoved', this.index, this.node);
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