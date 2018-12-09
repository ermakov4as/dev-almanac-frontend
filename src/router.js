import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/sciences/',
            name: 'sciences',
            component: () =>
                import ('./views/ScienceList.vue')
        },
        {
            path: '/sciences/:id/',
            name: 'discEdit',
            component: () =>
                import ('./views/ScienceEditor.vue')
        },
        {
            path: '/sciences/:id/upload_tree/',
            name: 'discTree',
            component: () =>
                import ('./views/ScienceTree.vue')
        },
        {
            path: '/sciences/:id_last/lessons/:id/',
            name: 'lessonEdit',
            component: () =>
                import ('./views/LessonEditor.vue')
        },
        {
            path: '/sciences/:id_last_1/lessons/:id_last/cards/:id/',
            name: 'cardEdit',
            component: () =>
                import ('./views/CardEditor.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () =>
                import ('./views/Login.vue')
        },
        {
            path: '/curator/homeworks/',
            name: 'curator',
            component: () =>
                import ('./views/Curator.vue')
        }
    ]
});