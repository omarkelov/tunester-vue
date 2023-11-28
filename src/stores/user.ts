import Cookies from 'js-cookie';
import { defineStore, getActivePinia } from 'pinia';

import { fetchLogin, fetchLogout } from '../api/authAPI';
import { handleFetching } from '../util/fetching';
import { Credentials, User } from '../util/types';


const USER_STORE_NAME = 'user';
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
    id: USER_STORE_NAME,
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
            resetOtherStores();
            redirect();
        },
    },
});

const resetOtherStores = () => {
    const activePinia = getActivePinia();

    if (activePinia) {
        Object.entries(activePinia.state.value)
            .forEach(([storeName, state]) => {
                if (storeName === USER_STORE_NAME) {
                    return;
                }

                const storeDefinition = defineStore(storeName, state);
                const store = storeDefinition(activePinia);
                store.$reset();
            });
    }
};
