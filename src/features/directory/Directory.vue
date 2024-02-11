<script setup lang='ts'>

import { Folder, FolderOpen } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import Music from '../../components/icons/Music.vue';
import PlayOrPause from '../../components/icons/PlayOrPause.vue';
import { MUSIC, PATH } from '../../router';
import { useDirectoryStore } from '../../stores/directory';
import { usePlayerStore } from '../../stores/player';
import {
    convertBytesToMegabytes,
    convertISODateToLocaleString,
    convertRatingCountByRating,
    convertBitrate,
    convertTime,
    trimFileExtension,
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

    if (directoryStore.directory.tracks[idx].path === playerStore.track?.path) {
        playerStore.toggle();
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
        <div class='text-center'>{{ directoryStore.directory.path }}</div>
        <ul class='mt-3'>
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
                    <div class='flex items-center gap-2'>
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
        <ul>
            <li
                v-for='(track, idx) in directoryStore.directory.tracks'
                :key='track.path'
                :class='`py-0.5 flex gap-3 justify-between cursor-pointer hover:bg-zinc-800 ${track.path === playerStore.track?.path ? "bg-zinc-800" : ""}`'
                @click='() => onTrackClicked(idx)'
            >
                <div class='flex items-center gap-2'>
                    <PlayOrPause
                        v-if='track.path === playerStore.track?.path'
                        :is-playing='playerStore.isPlaying'
                        non-actionable
                        :size='16'
                    />
                    <Music
                        v-else
                        :size='16'
                    />
                    <div>{{ trimFileExtension(trimPathPrefix(track.path)) }}</div>
                </div>
                <div class='flex gap-3'>
                    <!-- <div>{{ track.meta.track }}</div> -->
                    <!-- <div>{{ track.meta.artist }}</div> -->
                    <!-- <div>{{ track.meta.title }}</div> -->
                    <!-- <div>{{ track.meta.album }}</div> -->
                    <!-- <div>{{ track.meta.genre }}</div> -->
                    <div>{{ convertBitrate(track.meta.bitRate) }}</div>
                    <div>{{ convertTime(track.meta.duration) }}</div>
                    <div class='text-right'>{{ track.meta.comment?.rating ?? '-' }}</div>
                    <div class='w-20 text-right'>{{ convertBytesToMegabytes(track.meta.size) }}</div>
                    <div class='text-right'>{{ convertISODateToLocaleString(track.lastUpdated) }}</div>
                </div>
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
