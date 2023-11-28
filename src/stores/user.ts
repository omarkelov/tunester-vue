import { defineStore } from 'pinia';

import { fetchLogin, fetchLogout } from '../api/authAPI';
import { handleFetching } from '../util/fetching';
import { Credentials, User } from '../util/types';


const savedUserStr = localStorage.getItem('user');
const savedUser = savedUserStr
    ? JSON.parse(savedUserStr)
    : undefined;

type State = {
    user?: User;
}

export const useUserStore = defineStore({
    id: 'user',
    state: (): State => ({
        user: savedUser,
    }),
    actions: {
        async login(credentials: Credentials, signal: AbortSignal, redirect: () => void) {
            const { result: user, error } = await handleFetching<User>(
                (signal: AbortSignal) => fetchLogin(credentials, signal),
                signal,
            );

            if (error) {
                console.log(error);
                return;
            }

            this.user = user;

            localStorage.setItem('user', JSON.stringify(user));

            redirect();
        },
        async logout(signal: AbortSignal, redirect: () => void) {
            const { error } = await handleFetching<User>(
                (signal: AbortSignal) => fetchLogout(signal),
                signal,
            );

            if (error) {
                console.log(error);
                return;
            }

            this.user = undefined;

            localStorage.removeItem('user');

            redirect();
        },
    },
});
