<template>
    <nav class="navbar navbar-expand-md navbar-light bg-light mb-2">
        <router-link to="/">
            <a class="navbar-brand" href="#">Almanac <span class="red">20/80</span> Editor</a>
        </router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item mr-auto">
                    <router-link to="/sciences/"><span class="nav-link">Список дисциплин</span></router-link>
                </li>
            </ul>
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link disabled" href="#">Я автор</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        name: "SiteHeader"
    }
</script>
<style scoped>
    /*.header-navbar {*/
    /*background-color: darkslateblue;*/
    /*margin-bottom: 10px;*/
    /*border-radius: 10px;*/
    /*}*/
    .navbar-brand {
        text-transform: uppercase;
        font-weight: bold;
    }

    .navbar-light .navbar-nav .nav-link {
        color: #0D2D44;
    }
</style>
