<script setup lang='ts'>

import { onMounted, ref } from 'vue';
import Login from './components/Login.vue';
import NavBar from './components/NavBar.vue';
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

const handleUserLoggedOut = async () => {
    userRef.value = undefined;
    localStorage.removeItem('user');
};

</script>

<template>
    <div v-if='userRef'>
        <NavBar @userLoggedOut='handleUserLoggedOut' />
        <router-view />
    </div>
    <div v-else>
        <Login @userLoggedIn='handleUserLoggedIn' />
    </div>
</template>

<style scoped>

</style>
