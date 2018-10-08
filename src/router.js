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
            path: '/dashboard',
            name: 'dashboard',
            component: () =>
                import ('./views/Disciplines.vue')
        },
        {
            path: '/dashboard/sciences/:id/edit',
            name: 'discEdit',
            component: () =>
                import ('./views/DiscEdit.vue')
        },
        {
            path: '/dashboard/sciences/:id/tree-edit',
            name: 'discTree',
            component: () =>
                import ('./views/DiscTree.vue')
        }
    ]
})