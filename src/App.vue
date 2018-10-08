<template>
    <div class="container">
        <app-header></app-header>
        <div class="row">
            <div class="col-md-12">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    import './styles.css';
    import Header from './views/Header.vue';

    export default {
        components: {
            appHeader: Header
        }
    }
</script>

<style>

</style>
