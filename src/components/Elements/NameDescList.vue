<template>
    <div class="element-table">
        <div class="name-and-edit-line">
	        <h5 class="name-and-edit-label">{{ element.name }}</h5>
            <router-link
                    :to="editElementLink"
                    tag="button"
                    class="btn btn-orange btn-common name-and-edit-btn"
                    >РЕДАКТИРОВАТЬ</router-link>
        </div>
        <div class="desc-label">
            <p>{{ element.desc }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'element',
            'editPath'
        ],
        data() {
            return {
                editElementLink: {
                    path: `${ this.editPath }${ this.element.id }/edit`,
                    params: {
                        id_last: this.element.id,
                        id: this.$route.params.id
                    }
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
        margin: 0 30px -1px 30px;
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

    .name-and-edit-line {
        text-align: center;
        border: 1px solid gray;
        padding: 0;
    }

    .name-and-edit-line:before {
        height: 100%;
        display: inline-block;
        vertical-align: middle;
    }

    .name-and-edit-btn {
        display: inline-block;
        width: 20%;
        vertical-align: middle;
        border: 1px solid white;
    }

    .name-and-edit-label {
        display: inline-block;
        width: 80%;
        vertical-align: middle;
        margin: 0;
    }
</style>