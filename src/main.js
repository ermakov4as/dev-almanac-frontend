import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Notifications from 'vue-notification'
import vSelect from 'vue-select'
import VueAutosize from 'vue-autosize'

Vue.config.productionTip = false;

Vue.use(VueQuillEditor, /* { default global options } */ )
Vue.use(Notifications)
Vue.component('v-select', vSelect)
Vue.use(VueAutosize)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')