<script setup lang='ts'>

import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAbortController } from '../hooks/useAbortController.js';
import { MUSIC } from '../router';
import { useUserStore } from '../stores/user';


const loginRef = ref<string>('');
const passwordRef = ref<string>('');

const userStore = useUserStore();
const { signal } = useAbortController();

const route = useRoute();
const router = useRouter();

const onFormSubmit = async () => userStore.login(
    {
        login: loginRef.value,
        password: passwordRef.value,
    },
    signal,
    () => router.replace(route.query.redirect as string | undefined ?? { name: MUSIC })
);

</script>

<template>
    <div class='flex flex-col items-center pt-20'>
        <img src='/images/logo-big.png' alt='Tunester' />
        <form class='flex flex-col items-center mt-5' @submit.prevent='onFormSubmit'>
            <section class='flex flex-col gap-1 mb-5'>
                <label>Login</label>
                <input class='shadow-none bg-white text-black disabled:bg-slate-500 focus:outline-none' type='text'
                    v-model='loginRef'>
            </section>
            <section class='flex flex-col gap-1 mb-5'>
                <label>Password</label>
                <input class='shadow-none bg-white text-black disabled:bg-slate-500 focus:outline-none' type='password'
                    v-model='passwordRef'>
            </section>
            <button type='submit'>Login</button>
        </form>
    </div>
</template>
