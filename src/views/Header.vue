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

            <!-- Отображение спиннера, если нет соединения с сервером -->
            <!-- ПОКА НЕ РАБОТАЕТ: НЕ ОПИСАНЫ СИТУАЦИИ, В КОТОРЫХ БУДЕТ ЗАСЧИТАНО ОТСУТСТВИЕ ПОДКЛЮЧЕНИЯ -->
            <ul class="navbar-nav" v-if="!connected_to_server">
                <li class="nav-item">
                    <clip-loader class="custom-class" :size="30"></clip-loader>
                </li>
            </ul>

            <!-- Ссылка на вхо в аккаунт, если вход не выполнен -->
            <ul class="navbar-nav" v-else-if="!is_logged_in">
                <li class="nav-item">
                    <router-link to="/login/"><span class="nav-link">Войти</span></router-link>
                </li>
            </ul>

            <!-- Ссылка на действия с аккаунтом, если вход выполнен -->
            <ul class="navbar-nav mr-2" v-else>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown"
                       aria-haspopup="true" aria-expanded="false">
                        {{ user.email }}
                    </a>

                    <!-- Выпадающее меню действий с аккаунтом -->
                    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">

                        <!-- Ссылка на выход из аккаунта -->
                        <a class="dropdown-item" @click="logout">Выход</a>

                    </div>

                </li>
            </ul>

        </div>

    </nav>
</template>

<script>
    import {LOGIN_HTTP} from "../http-common";
    import Cookies from 'js-cookie';

    export default {
        name: "SiteHeader",

        methods: {
            // Выход из аккаунта
            logout() {
                LOGIN_HTTP.post('/logout/')
                    .then((response) => {
                        this.$store.dispatch('logout');
                        this.$router.push('/login');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
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
        },

        // Проверка данных пользователя в кукиз перед началом работы
        mounted() {
            this.$store.commit('checkCookies');
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
