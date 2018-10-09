import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/sciences',
            name: 'sciences',
            component: () =>
                import ('./views/Disciplines.vue')
        },
        {
            path: '/sciences/:id/edit',
            name: 'discEdit',
            component: () =>
                import ('./views/DiscEdit.vue')
        },
        {
            path: '/sciences/:id/tree-edit',
            name: 'discTree',
            component: () =>
                import ('./views/DiscTree.vue')
        },
        {
            path: '/sciences/:id_last/lesson/:id/edit',
            name: 'lessonEdit',
            component: () =>
                import ('./views/LessonEdit.vue')
        }
    ]
})