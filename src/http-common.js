import axios from 'axios';
import store from './store/store';
import router from './router';

//const API_URL = 'http://127.0.0.1:8081/';
//const API_URL = 'http://almanacredactortest-dev.us-east-2.elasticbeanstalk.com/api/v1/editor/';
const API_URL = 'http://almanacredactortest-dev.us-east-2.elasticbeanstalk.com/api/v1/';

export const HTTP = axios.create({
    baseURL: API_URL + 'editor/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        //"Authorization": "Bearer b21efd0f70aaf0d428a49cb1f4c51288f7c99b5e"
        "Authorization": `Bearer ${store.getters.token}`
    }
});

export const HTTP_UPLOAD = axios.create({
    baseURL: API_URL + 'editor/',
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${store.getters.token}`
    }
});

export const LOGIN_HTTP = axios.create({
    baseURL: API_URL + 'users/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});

export const USERS_HTTP = axios.create({
    baseURL: API_URL + 'users/',
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${store.getters.token}` //'Bearer 48a8283100d31c2e17891bfcec67ae9d34dd4791' //`Bearer ${store.getters.token}`
    }
});

// ЗДЕСЬ КОСТЫЛЬ
export function usersHttpStrange(token) {
    const USERS_HTTP = axios.create({
        baseURL: API_URL + 'users/',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` //'Bearer 48a8283100d31c2e17891bfcec67ae9d34dd4791' //`Bearer ${store.getters.token}`
        }
    });
    return USERS_HTTP;
};

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

HTTP.interceptors.response.use(null, function(error) {
    console.log(error);
    if (error.response.status === 401 || error.response.status === 403) {
        console.log('Failed to login');
        router.push('/login');
    };
    return Promise.reject(error)
});