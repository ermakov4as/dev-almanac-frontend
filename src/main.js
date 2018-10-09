import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.use(VueMaterial)

axios.defaults.baseURL = 'http://127.0.0.1:8081'

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')