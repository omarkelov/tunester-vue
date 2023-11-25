<script setup lang='ts'>

import { useRouter } from 'vue-router';

import { fetchLogout } from '../api/authAPI';
import { useAbortController } from '../hooks/useAbortController';
import { useFetching } from '../hooks/useFetching';
import { LOGIN } from '../router';


const router = useRouter();
const abortController = useAbortController();

const onLogoutClicked = async () => {
    const { error } = await useFetching(
        (signal: AbortSignal) => fetchLogout(signal),
        abortController.signal,
    );

    if (error) {
        console.log(error);
        return;
    }

    localStorage.removeItem('user');

    router.push({ name: LOGIN });
};

</script>

<template>
    <button @click='onLogoutClicked'>Logout</button>
</template>
