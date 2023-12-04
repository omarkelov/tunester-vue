<script setup lang='ts'>

import { watch } from 'vue';
import { useRoute } from 'vue-router';

import { MUSIC, PATH } from '../router';
import { useDirectoryStore } from '../stores/directory';
import { usePlayerStore } from '../stores/player';


const directoryStore = useDirectoryStore();
const playerStore = usePlayerStore();
const route = useRoute();

watch(
    route,
    async (_value, _oldValue, onCleanup) => {
        const abortController = new AbortController();

        onCleanup(() => {
            abortController.abort();
        });

        directoryStore.loadDirectory(
            route.params[PATH] as string | undefined ?? '',
            abortController.signal,
        );
    },
    {
        immediate: true
    },
);

const onTrackClicked = (idx: number) => {
    if (directoryStore.status !== 'success') {
        return;
    }

    playerStore.setPlaylist({
        tracks: directoryStore.directory.tracks,
        idx
    });
};

</script>

<template>
    <div v-if='["initial", "loading"].includes(directoryStore.status)'>
        <span>Loading...</span>
    </div>
    <div v-else-if='directoryStore.status === "error"'>
        <span>{{ directoryStore.error }}</span>
    </div>
    <div v-else-if='directoryStore.status === "success"'>
        <div>Directory ({{ $route.params.path }})</div>
        <div>{{ directoryStore.directory.path }}</div>
        <div>Directories:</div>
        <ul>
            <li
                v-for='directory in directoryStore.directory.directories'
                :key='directory.path'
            >
                <router-link :to='{ name: MUSIC, params: { [PATH]: directory.path } }'>
                    {{ directory.path }}
                </router-link>
            </li>
        </ul>
        <div>Tracks:</div>
        <ul>
            <li
                v-for='(track, idx) in directoryStore.directory.tracks'
                :key='track.path'
                @click='() => onTrackClicked(idx)'>
                {{ track.path }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
