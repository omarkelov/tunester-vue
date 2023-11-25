<script setup lang='ts'>

import { fetchLogout } from '../api/authAPI';
import { useAbortController } from '../hooks/useAbortController';
import { useFetching } from '../hooks/useFetching';


const emit = defineEmits<{
    (e: 'userLoggedOut'): void,
}>();

const abortController = useAbortController();

const onLogoutClicked = async () => {
    const { error } = await useFetching(
        (signal: AbortSignal) => fetchLogout(signal),
        abortController.signal,
    );

    if (!error) {
        emit('userLoggedOut');
    } else {
        console.log(error);
    }
};

</script>

<template>
    <button @click='onLogoutClicked'>Logout</button>
</template>

<style scoped></style>
