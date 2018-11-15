import Cookies from 'js-cookie';

const state = {
    _user: null,
    _token: null,
    //_connected_to_server: false
    // ПОКА НЕ РАБОТАЕТ
    _connected_to_server: true
};

const getters = {
    token(state) {
        return state._token || Cookies.get('se_token');
    },
    user(state) {
        return state._user;
    },
    is_logged(state) {
        return state._user !== null;
    },
    connected_to_server(state) {
        return state._connected_to_server;
    }
};

const mutations = {
    token(state, token) {
        state._token = token;
        Cookies.set('se_token', token);
    },
    user(state, user) {
        state._user = user;
    },
    connected_to_server(state, conn) {
        state._connected_to_server = conn;
    }
};

const actions = {
    logout(context) {
        context.commit('token', null);
        Cookies.remove('se_token');
        context.commit('user', null);
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};