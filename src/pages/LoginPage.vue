<script setup lang='ts'>

import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchLogin } from '../api/authAPI.js';
import { useAbortController } from '../hooks/useAbortController.js';
import { useFetching } from '../hooks/useFetching.js';
import { MUSIC } from '../router';
import { User } from '../util/types.js';


const loginRef = ref<string>('');
const passwordRef = ref<string>('');

const abortController = useAbortController();

const route = useRoute();
const router = useRouter();

const onFormSubmit = async () => {
    const { result: user, error } = await useFetching<User>(
        (signal: AbortSignal) => fetchLogin({
            login: loginRef.value,
            password: passwordRef.value,
        }, signal),
        abortController.signal,
    );

    if (!user) {
        console.log(error);
        return;
    }

    localStorage.setItem('user', JSON.stringify(user));

    router.replace(route.query.redirect as string | undefined ?? { name: MUSIC });
};

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
