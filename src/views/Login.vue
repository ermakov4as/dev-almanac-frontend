<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 offset-md-3">
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2>Вход в систему</h2>
                            <p>Пожалуйста, введите ваши email и пароль</p>
                        </div>
                        <div class="form-group" v-if="errors.non_field_errors">
                            <label class="input-label" v-for="(error, index) in errors.non_field_errors" :key="index">{{error}}</label>
                        </div>
                        <div class="form-group">
                            <label class="input-label" v-if="errors.email"
                                   v-for="(error, index) in errors.email" :key="index">{{error}}</label>
                            <input type="email" class="form-control" :class="{'error-input': errors.email.length}"
                                   placeholder="Email" v-model="email" @change="clear_errors('email')">
                        </div>
                        <div class="form-group">
                            <label class="input-label" v-if="errors.password"
                                   v-for="(error, index) in errors.password" :key="index">{{error}}</label>
                            <input type="password" class="form-control"
                                   :class="{'error-input': errors.password.length}" placeholder="Пароль"
                                   v-model="password" @change="clear_errors('password')">
                        </div>
                        <div class="forgot">
                            <a href="reset.html">Забыли пароль?</a>
                        </div>
                        <div class="btn bg-black btn-primary" @click="login" v-html="loggin_button_text[state]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {LOGIN_HTTP, USERS_HTTP, usersHttpStrange} from "../http-common";
    import Cookies from "js-cookie";


    export default {
        name: "login",
        data() {
            return {
                email: "",
                password: "",
                errors: {
                    email: [],
                    password: [],
                    non_field_errors: []
                },
                state: "default",
                loggin_button_text: {
                    "default": "Войти",
                    "entering": "<i class='fa fa-spinner fa-pulse'></i> Производится вход"
                }
            }
        },
        methods: {
            login(event) {
                for (let field_name in this.errors) {
                    if (this.errors.hasOwnProperty(field_name)) {
                        this.clear_errors(field_name);
                    }
                };
                if (this.email === "") {
                    this.errors.email.push("Необходимое поле");
                };
                if (this.password === "") {
                    this.errors.password.push("Необходимое поле");
                };
                if (this.email !== "" && this.password !== "") {
                    this.state = "entering";
                    console.log(`Передаю: "email": ${this.email}, "password": ${this.password}`);
                    LOGIN_HTTP.post('login/', {
                    //HTTP.post('login/', {   
                        "email": this.email,
                        "password": this.password
                    })
                        .then((response) => {
                            console.log('good response1');
                            this.$store.commit('token', response.data['key']);
                            //this.$router.push('/sciences/');
                            console.log(this.$store.getters.token);
                            
                            /*USERS_HTTP.get('user/')
                                .then((response) => {
                                    this.$store.commit('user', response.data);
                                    this.$router.push('/sciences/');
                            });*/
                            // ЗДЕСЬ КОСТЫЛЬ
                            usersHttpStrange(this.$store.getters.token).get('user/')
                                .then((response) => {
                                        this.$store.commit('user', response.data);
                                        this.$router.push('/sciences/');
                                });
                        })
                        .catch((error) => {
                            console.log('bad response1');
                            console.log(error);
                            this.set_errors(error.response.data);
                            this.password = "";
                            this.state = "default";
                        })
                };
            },
            clear_errors(field_name) {
                if (this.errors.hasOwnProperty(field_name)) {
                    while (this.errors[field_name].length > 0) {
                        this.errors[field_name].pop();
                    };
                };
            },
            set_errors(errors_dict) {
                for (let field_name in this.errors) {
                    if (this.errors.hasOwnProperty(field_name)) {
                        this.clear_errors(field_name);
                        if (errors_dict.hasOwnProperty(field_name)) {
                            console.log(field_name);
                            for (let index = 0; index < errors_dict[field_name].length; index++) {
                                this.errors[field_name].push(errors_dict[field_name][index]);
                            };
                        };
                    };
                };
            }
        },
        mounted() {
            if (this.$store.getters.token) {
                this.$router.push('/');
            };
        }
    }
</script>

<style scoped>
    .panel {
        text-align: center;
    }

    .panel h2 {
        color: #444444;
        font-size: 18px;
        margin: 0 0 8px 0;
    }

    .panel p {
        color: #777777;
        font-size: 14px;
        margin-bottom: 30px;
        line-height: 24px;
    }

    .login-form .form-control {
        background: #f7f7f7 none repeat scroll 0 0;
        border: 1px solid #d4d4d4;
        border-radius: 4px;
        font-size: 14px;
        height: 50px;
        line-height: 50px;
    }

    .main-div {
        background: #ffffff none repeat scroll 0 0;
        border-radius: 2px;
        margin: 10px auto 30px;
    }

    .login-form .form-group {
        margin-bottom: 10px;
    }

    .forgot a {
        color: #777777;
        font-size: 14px;
        text-decoration: underline;
    }

    .login-form .btn.btn-primary {
        font-size: 14px;
        color: #d1dde9;
        border: none;
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0;
    }

    .login-form .btn.btn-primary:hover {
        background-color: #d1dde9;
        color: #0D2D44;
    }

    .forgot {
        text-align: left;
        margin-bottom: 30px;
    }

    .botto-text {
        color: #ffffff;
        font-size: 14px;
        margin: auto;
    }

    .back {
        text-align: left;
        margin-top: 10px;
    }

    .back a {
        color: #444444;
        font-size: 13px;
        text-decoration: none;
    }

    .error-input {
        box-shadow: 0 0 10px #c42432;
    }

    .input-label {
        color: #c42432;
        font-size: 13px;
        padding-left: 5px;
    }

</style>