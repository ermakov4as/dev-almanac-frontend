<template>
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-2">
        
        <!-- Ссылка на домашнюю страницу -->
        <router-link to="/">
            <a class="navbar-brand" href="#">Almanac <span class="red">20/80</span> Editor</a>
        </router-link>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarCollapse">

            <!-- Ссылка на список дисциплин -->
            <ul class="navbar-nav mr-auto">
                <li class="nav-item mr-auto">
                    <router-link to="/sciences/"><span class="nav-link">Список дисциплин</span></router-link>
                </li>
            </ul>

            <!-- Нерабочая ссылка на настройку аккаунта и доступа -->
            <!--
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link disabled" href="#">Я автор</a>
                </li>
            </ul>
            -->

            <ul class="navbar-nav" v-if="!connected_to_server">
                <li class="nav-item">
                    <!--<i class='fa fa-spinner fa-pulse fa-2x'></i>-->
                    <p>Нет соединения с сервером :(</p>
                </li>
            </ul>
            <ul class="navbar-nav" v-else-if="!is_logged_in">
                <li class="nav-item">
                    <router-link to="/login"><span class="nav-link">Войти</span></router-link>
                </li>
                <!--<li class="nav-item">-->
                <!--<router-link to="/grammar-tren"><span class="nav-link">Регистрация</span></router-link>-->
                <!--</li>-->
            </ul>
            <ul class="navbar-nav mr-2" v-else>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false">
                        {{ user.email }}
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                        <a class="dropdown-item" href="#">Профиль</a>
                        <a class="dropdown-item" @click="logout">Выход</a>
                    </div>
                </li>
            </ul>
            <!--<form class="form-inline mt-2 mt-md-0">-->
            <!--<input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">-->
            <!--<button class="btn btn-success my-2 my-sm-0" type="submit">Search</button>-->
            <!--</form>-->

        </div>

    </nav>
</template>

<script>
    import {LOGIN_HTTP} from "../http-common";
    import Cookies from 'js-cookie';

    export default {
        name: "SiteHeader",

        methods: {
            logout() {
                LOGIN_HTTP.post('/logout/')
                //HTTP.post('/logout/')
                    .then((response) => {
                        this.$store.dispatch('logout');
                        this.$router.push('/login');
                    })
            }
        },

        computed: {
            is_logged_in() {
                return this.$store.getters.is_logged;
            },
            user() {
                return this.$store.getters.user;
            },
            connected_to_server() {
                return this.$store.getters.connected_to_server;
            }

        }
    }
</script>

<style scoped>
    .navbar-brand {
        text-transform: uppercase;
        font-weight: bold;
    }

    .navbar-light .navbar-nav .nav-link {
        color: #0D2D44;
    }

    .dropdown-item {
        cursor: pointer;
    }
</style>
