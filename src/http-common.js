import axios from 'axios'

//const API_URL = 'http://127.0.0.1:8081/';
const API_URL = 'http://almanacredactortest-dev.us-east-2.elasticbeanstalk.com/api/v1/';

export const HTTP = axios.create({
    baseURL: API_URL,
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
});
export const HTTP_UPLOAD = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "multipart/form-data",
    }
});