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
    import {HTTP} from "./http-common";

    export default {
        components: {
            appHeader: Header
        },
        created() {
            HTTP.get('/users/user/')
                .then((response) => {
                    this.$store.commit('user', response.data);
                    this.$store.commit('connected_to_server', true);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        this.$store.commit('connected_to_server', true);
                    }
                })

        }
    };
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
