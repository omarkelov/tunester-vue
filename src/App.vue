<script setup lang='ts'>

import { onMounted, ref } from 'vue';
import Login from './components/Login.vue';
import { User } from './util/types';


const userRef = ref<User>();

onMounted(() => {
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    if (user) {
        userRef.value = user;
    }
});

const handleUserLoggedIn = (user: User) => {
    userRef.value = user;
    localStorage.setItem('user', JSON.stringify(user));
};

</script>

<template>
    <div v-if='userRef'>
        <router-view />
    </div>
    <div v-else>
        <Login @userLoggedIn='handleUserLoggedIn' />
    </div>
</template>

<style scoped>

</style>
