import axios from 'axios';
import store from './store/store';
import router from './router';

const API_URL = 'http://almanacredactortest-dev.us-east-2.elasticbeanstalk.com/api/v1/';

// Стандартный HTTP запрос для редактора
export const HTTP = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        //"Authorization": "Bearer b21efd0f70aaf0d428a49cb1f4c51288f7c99b5e"
        "Authorization": `Bearer ${store.getters.token}`
    }
});

// Стандартный HTTP запрос для загрузки в редактор
export const HTTP_UPLOAD = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${store.getters.token}`
    }
});

// HTTP запрос для авторизации
export const LOGIN_HTTP = axios.create({
    baseURL: API_URL + 'users/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

// HTTP запрос для доступа к данным пользователя
/*export const USERS_HTTP = axios.create({
    baseURL: API_URL + 'users/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.getters.token}`
    }
});*/

// HTTP запрос для доступа к данным пользователя
// ЗДЕСЬ КОСТЫЛЬ
export function usersHttpStrange(token) {
    const USERS_HTTP_STRANGE = axios.create({
        baseURL: API_URL + 'users/',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    return USERS_HTTP_STRANGE;
};

// Проверка авторизации при HTTP запросе
HTTP.interceptors.request.use(
    function(config) {
        const token = store.getters.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        };
        return config;
    },
    function(error) {
        return Promise.reject(error);
    }
);

// Действия при ошибки авторизации
HTTP.interceptors.response.use(null, function(error) {
    console.log(error);
    if (error.response.status === 401 || error.response.status === 403) {
        console.log('Failed to login');
        router.push('/login');
    };
    return Promise.reject(error)
});