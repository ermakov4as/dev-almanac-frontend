<template>
    <nav class="navbar navbar-expand-lg navbar-dark header-navbar">
        <div>
            <router-link to="/" class="navbar-brand">Almanac 20 / 80</router-link>
        </div>

        <div class="collapse navbar-collapse">
            <ul class="navbar-nav mr-auto">
                <router-link
                        to="/sciences/"
                        class="nav-item active"
                        tag="li">
                    <a class="nav-link">Список дисциплин</a>
                </router-link>
            </ul>
            <ul class="navbar-nav mr-right">
                <li class="nav-item">
                    <a class="nav-link disabled" href="#">Я автор</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        data() {
            return {
                isDropdownOpen: false
            }
        }
    }
</script>

<style scoped>
    .header-navbar {
        background-color: darkslateblue;
        margin-bottom: 10px;
        border-radius: 10px;
    }
</style>
