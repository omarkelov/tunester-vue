<script setup lang='ts'>

import { useRouter } from 'vue-router';

import { useAbortController } from '../hooks/useAbortController';
import { LOGIN } from '../router';
import { useUserStore } from '../stores/user';


const userStore = useUserStore();
const { signal } = useAbortController();
const router = useRouter();

const onLogoutClicked = async () => userStore.logout(
    signal,
    () => router.push({ name: LOGIN })
);

</script>

<template>
    <button @click='onLogoutClicked'>Logout ({{ userStore.user?.username }})</button>
</template>
