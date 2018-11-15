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
        return state._user !== null
    },

    connected_to_server(state) {
        return state._connected_to_server;
    }
};

const mutations = {
    // Записывает токен в хранилище и в кукиз
    token(state, token) {
        state._token = token;
        Cookies.set('se_token', token);
    },

    // Записываем данные пользователя в хранилище и в кукиз
    user(state, user) {
        state._user = user;
        Cookies.set('se_user', user);
    },

    // Записываем состояние подключения к серверу в хранилище
    connected_to_server(state, conn) {
        state._connected_to_server = conn;
    },

    // При отсутствии данных в хранилище - пробуем извлечь их из кукиз
    checkCookies(state) {
        if (state._user === null) {
            let userData = Cookies.get('se_user');;
            if (userData) {
                state._user = JSON.parse(userData);
            };
        };
    }
};

const actions = {
    // Обнуляем данные в хранилище и удаляем токен из кукиз при выходе из аккаунта
    logout(context) {
        context.commit('token', null);
        Cookies.remove('se_token');
        context.commit('user', null);
        Cookies.remove('se_user');
    }
};

export default {
    state,
    getters,
    mutations,
    actions
};