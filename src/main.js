import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import Notifications from 'vue-notification';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false;

library.add(faCoffee);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false;

Vue.use(VueQuillEditor, /* { default global options } */ );
Vue.use(Notifications);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');