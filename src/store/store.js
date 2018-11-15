import Vue from 'vue';
import Vuex from 'vuex';
import scienceTree from './modules/scienceTree';
import login from './modules/login';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    getters: {},
    actions: {},
    modules: {
        scienceTree,
        login
    }
});