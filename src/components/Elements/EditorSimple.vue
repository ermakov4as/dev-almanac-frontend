<template>
    <!-- Пока что следим за мышью и клавиатурой для приёма / отправки данных в родительский компонент -->
    <div 
            class="quill-editor-example" 
            @mouseleave="onEditorAction($event)" 
            @mouseenter="onEditorMouseEnter($event)"
            @click="onEditorAction($event)"
            @keypress="onEditorAction($event)">
        <!-- quill-editor -->
        <quill-editor ref="myTextEditor"
                v-model="content"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
        </quill-editor>
    </div>
</template>

<script>
    import hljs from 'highlight.js';

    export default {
        props: [
            'contentForQuil',
            'dataReady'
        ],
        data() {
            return {
                name: 'quilEditor',
                content: ``,
                editorOption: {
                    modules: {
                        // Некоторые опции отключены за ненадобностью, для включения - просто раскомментить
                        toolbar: [
                            ['bold', 'italic', 'underline'/*, 'strike'*/],
                            //['blockquote', 'code-block'],
                            //[{ 'header': 1 }, { 'header': 2 }],
                            [{header: [false, 1, 2, 3]}],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            //[{ 'script': 'sub' }, { 'script': 'super' }],
                            //[{ 'indent': '-1' }, { 'indent': '+1' }],
                            //[{ 'direction': 'rtl' }],
                            //[{ 'size': ['small', false, 'large', 'huge'] }],
                            //[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'font': [] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'align': [] }],
                            //['clean'],
                            [/*'link', */'image', 'video']
                        ],
                        syntax: {
                            highlight: text => hljs.highlightAuto(text).value
                        }
                    }
                },
                firstClick: true,
                firstDataReady: true
            }
        },
        methods: {
            onEditorBlur(editor) {
                this.$emit('quilUpdated', this.content)
            },
            onEditorFocus(editor) {
                if (this.firstClick) {
                    this.content = this.contentForQuil,
                    this.firstClick = false
                }
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            },
            // По вхождению мыши в область редактора - запрашиваем данные, если они ещё не получены
            onEditorMouseEnter(editor) {
                if (this.dataReady & this.firstDataReady) {
                    this.content = this.contentForQuil;
                    this.firstDataReady = false;
                }
            },
            // По действию в редакторе - возвращаем данные в родительский компонент.
            onEditorAction(editor) {
                this.$emit('quilUpdated', this.content)
            }
        },
        computed: {
            editor() {
                return this.$refs.myTextEditor.quill
            },
            contentCode() {
                return hljs.highlightAuto(this.content).value
            }
        },
        // Через 0,3с и 1с после создания - запрашиваем данные, если они ещё не получены
        created() {
            setTimeout(() => {
                if (this.dataReady & this.firstDataReady) {
                    this.content = this.contentForQuil;
                    this.firstDataReady = false;
                }
            }, 300),
            setTimeout(() => {
                if (this.dataReady & this.firstDataReady) {
                    this.content = this.contentForQuil;
                    this.firstDataReady = false;
                }
            }, 1000)
        }
    }
</script>

<style lang="scss" scoped>
    .quill-code {
        border: none;
        height: auto;
        > code {
            width: 100%;
            margin: 0;
            padding: 1rem;
            border: 1px solid #ccc;
            border-top: none;
            border-radius: 0;
            height: 10rem;
            overflow-y: auto;
            resize: vertical;
        }
    }
</style>