<script setup lang='ts'>

import { ref } from 'vue';

import { fetchLogin } from '../api/authAPI';
import { useAbortController } from '../hooks/useAbortController';
import { useFetching } from '../hooks/useFetching';
import { User } from '../util/types';


const loginRef = ref<string>('');
const passwordRef = ref<string>('');

const emit = defineEmits<{
    (e: 'userLoggedIn', user: User): void,
}>();

const abortController = useAbortController();

const onFormSubmit = async () => {
    const { result: user, error } = await useFetching<User>(
        (signal: AbortSignal) => fetchLogin({
            login: loginRef.value,
            password: passwordRef.value,
        }, signal),
        abortController.signal,
    );

    if (user) {
        emit('userLoggedIn', user);
    } else if (error) {
        console.log(error);
    }
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
