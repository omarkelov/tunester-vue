<script setup lang='ts'>

import { Folder, FolderOpen } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { MUSIC, PATH } from '../../router';
import { useDirectoryStore } from '../../stores/directory';
import { usePlayerStore } from '../../stores/player';
import {
    convertBytesToMegabytes,
    convertISODateToLocaleString,
    convertRatingCountByRating,
    trimPathPrefix,
} from '../../util/strings';


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

const hoveredDirectory = ref<string>();

const onTrackClicked = (idx: number) => {
    if (directoryStore.status !== 'success') {
        return;
    }

    playerStore.setPlaylist({
        path: directoryStore.directory.path,
        tracks: directoryStore.directory.tracks,
        idx,
    });
};

</script>

<template>
    <div
        v-if='directoryStore.status === "success"'
        class='mx-3'
    >
        <div>Directory ({{ $route.params.path }})</div>
        <div>{{ directoryStore.directory.path }}</div>
        <ul>
            <li
                v-for='directory in directoryStore.directory.directories'
                :key='directory.path'
            >
                <router-link
                    class='py-0.5 flex gap-3 justify-between hover:bg-zinc-800'
                    :to='{ name: MUSIC, params: { [PATH]: directory.path } }'
                    @mouseenter='() => hoveredDirectory = directory.path'
                    @mouseleave='() => hoveredDirectory = undefined'
                >
                    <div class='flex gap-2'>
                        <FolderOpen
                            v-if='hoveredDirectory === directory.path'
                            :size='16'
                        />
                        <Folder
                            v-else
                            :size='16'
                        />
                        <div>{{ trimPathPrefix(directory.path) }}</div>
                    </div>
                    <div class='flex gap-3'>
                        <div class='text-right'>{{ convertRatingCountByRating(directory.ratingCountByRating) }}</div>
                        <div class='w-20 text-right'>{{ convertBytesToMegabytes(directory.size) }}</div>
                        <div class='text-right'>{{ convertISODateToLocaleString(directory.lastUpdated) }}</div>
                    </div>
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
    <div v-else-if='directoryStore.status === "error"'>
        <span>{{ directoryStore.error }}</span>
    </div>
    <div v-else>
        <span>Loading...</span>
    </div>
</template>

<style scoped></style>
