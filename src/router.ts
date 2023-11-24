import { createRouter, createWebHistory } from 'vue-router';

import Directory from './components/Directory.vue';


export const MUSIC = '/music';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: `${MUSIC}/:path(.*)?`,
            component: Directory
        },
    ],
});
