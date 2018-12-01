<template>
    <transition v-if="kolvo > 0" name="UploadScheme">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container modal-container-small">

                    <div class="modal-header">
                        <slot name="header">
                            Озвучить предложения ({{ kolvo }})
                            <div class="btn btn-default btn-danger" @click="$emit('close')">
                                Отмена
                            </div>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            <div>Здесь будет select выбора поля</div>
                            <div>Здесь будет select выбора персонала</div>
                        </slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer">
                            <div class="btn btn-default btn-success center">
                                Здесь будет отправить в бот
                            </div>
                        </slot>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: ['kolvo', 'examples'],
        data() {
            return {

            };
        },

        methods: {
           
        },

        mounted() {
            if (this.kolvo <= 0) {
                this.$notify({
                    group: 'foo',
                    type: "error",
                    title: 'Озвучивание невозможно',
                    text: 'Не выбрано ни одного элемента'
                });
                this.$emit('close');
            };
        }
    }
</script>

<style scoped>
    body {
        font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    }

    #app {
        max-width: 30em;
        margin: 1em auto;
    }

    #app .dropdown li {
        border-bottom: 1px solid rgba(112, 128, 144, 0.1)
    }

    #app .dropdown li:last-child {
        border-bottom: none;
    }

    #app .dropdown li a {
        padding: 10px 20px;
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 1.25em;
    }

    #app .dropdown li a .fa {
        padding-right: 0.5em;
    }
</style>
