import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalized,
    RouteRecordRaw,
} from 'vue-router';

import LoginPage from './pages/LoginPage.vue';
import MusicPage from './pages/MusicPage.vue';


export const LOGIN = 'login';

export const MUSIC = 'music';
export const PATH = 'path';

const anonymousRoutes: RouteRecordRaw[] = [
    {
        name: LOGIN,
        path: `/${LOGIN}`,
        component: LoginPage
    },
];

const userRoutes: RouteRecordRaw[] = [
    {
        name: MUSIC,
        path: `/${MUSIC}/:${PATH}(.*)?`,
        component: MusicPage
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes: [...anonymousRoutes, ...userRoutes],
    sensitive: true,
});

const navigateUser = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.name && userRoutes.find(route => route.name === to.name)) {
        next();
    } else {
        next({ name: MUSIC });
    }
};

const navigateAnonymous = (to: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.name && anonymousRoutes.find(route => route.name === to.name)) {
        next();
    } else {
        next({
            name: LOGIN,
            query: userRoutes.find(route => route.name === to.name) ? { redirect: to.fullPath } : {},
        });
    }
};

router.beforeEach((to, _from, next) => (localStorage.getItem('user') ? navigateUser : navigateAnonymous)(to, next));
