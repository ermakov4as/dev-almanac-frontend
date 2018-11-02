<template>
    <div>
        <app-header></app-header>
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <router-view></router-view>
                </div>
            </div>
        </div>
        <notifications group="foo"/>
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
    .red {
        color: #D10000;
    }

    .bg-red {
        color: white;
        background-color: #D10000;
    }

    .black {
        color: #0D2D44;
    }

    .bg-black {
        color: white;
        background-color: #0D2D44;;
    }
</style>
