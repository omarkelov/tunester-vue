import Cookies from 'js-cookie';
import { defineStore } from 'pinia';

import { fetchLogin, fetchLogout } from '../api/authAPI';
import { handleFetching } from '../util/fetching';
import { Credentials, User } from '../util/types';


const USER = 'user';
const USER_COOKIE_EXPIRATION_TIME_DAYS = 180;

const savedUserStr = Cookies.get(USER);
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

            Cookies.set(USER, JSON.stringify(user), { expires: USER_COOKIE_EXPIRATION_TIME_DAYS });

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

            Cookies.remove(USER);

            redirect();
        },
    },
});
