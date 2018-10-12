<template>
    <md-card>
        <md-card-media>
            <div 
                    class="quill-editor-example" 
                    @mouseleave="onEditorMouseLeave($event)" 
                    @mouseenter="onEditorMouseEnter($event)"
                    @click="onEditorMouseLeave($event)"
                    @keypress="onEditorMouseLeave($event)">
                <!-- quill-editor -->
                <!--p>{{ content }}</p-->
                <quill-editor ref="myTextEditor"
                        v-model="content"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
                </quill-editor>
                <!--div class="quill-code">
                    <code class="hljs" v-html="contentCode"></code>
                </div-->
            </div>
        </md-card-media>
    </md-card>
</template>

<script>
    import hljs from 'highlight.js';

    export default {
        props: [
            'contentForQuil',
            'dataReady'
        ],
        data() {
            //let contentLocal = this.contentForQuil;
            return {
                name: 'quilEditor',
                content: ``,//contentLocal,//`<h2 class="ql-align-center"><span class="ql-font-serif">Text content loading..</span></h2>`,
                editorOption: {
                    modules: {
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
                //console.log('editor blur!', editor)
                this.$emit('quilUpdated', this.content)
            },
            onEditorFocus(editor) {
                //console.log('editor focus!', editor)
                if (this.firstClick) {
                    this.content = this.contentForQuil,
                    this.firstClick = false
                }
            },
            onEditorReady(editor) {
                console.log('editor ready!', editor)
            },
            onEditorMouseEnter(editor) {
                if (this.dataReady & this.firstDataReady) {
                    this.content = this.contentForQuil;
                    this.firstDataReady = false;
                }
            },
            onEditorMouseLeave(editor) {
                //console.log('MOUSE!')
                this.$emit('quilUpdated', this.content)
                if (this.dataReady & this.firstDataReady) {
                    this.content = this.contentForQuil;
                    this.firstDataReady = false;
                }
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