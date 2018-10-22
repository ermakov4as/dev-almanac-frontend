import axios from 'axios'

//const API_URL = 'http://127.0.0.1:8081/';
const API_URL = 'http://almanacredactortest-dev.us-east-2.elasticbeanstalk.com/api/v1/';

export const HTTP = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer b21efd0f70aaf0d428a49cb1f4c51288f7c99b5e"
    }
});
export const HTTP_UPLOAD = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    }
});