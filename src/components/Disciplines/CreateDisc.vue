<template>
    <div>
        <router-link
                :to="newDiscLink"
                tag="button"
                class="btn btn-custom-success-oval"
                ><a class="custom-btn-link">СОЗДАТЬ НОВУЮ</a></router-link>
    </div>
</template>

<script>
    export default {
         data() {
            let id = 0;
            return {
                newDiscLink: {
                    path: `/dashboard/sciences/${ id }/edit`,
                    params: { id }
                }
            }
        }
    }
</script>

<style scoped>
    .btn-custom-success-oval {
        margin-top: 20px;
        font-size: 14px;
        font-weight: 500;
        color: white;
        border-radius: 25px;
        padding: 7px 12px;
        background-color: #00d014;
    }

    .btn-custom-success-oval:hover {
        background-color: lime;
    }

    .custom-btn-link {
        color: white;
        font-size: 14px;
        font-weight: 500;
    }

    .custom-btn-link:hover {
        text-decoration: none;
    }
</style>
