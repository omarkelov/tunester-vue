<script setup lang='ts'>

import { useRoute } from 'vue-router';

import { fetchGetMusic } from '../api/musicAPI';
import { useWatchFetching } from '../hooks/useFetching';
import { MUSIC, PATH } from '../router';
import { Directory, Track } from '../util/types';


const route = useRoute();
const {
    isLoading,
    result: directoryInfo,
    error
} = useWatchFetching<Directory>(
    (signal: AbortSignal) => fetchGetMusic(route.params[PATH] as string | undefined ?? '', signal),
    route
);

const emit = defineEmits<{
    (e: 'playTrack', track: Track): void
}>();

const onTrackClicked = (track: Track) => {
    emit('playTrack', track);
};

</script>

<template>
    <div v-if='isLoading'>
        <span>Loading...</span>
    </div>
    <div v-else-if='error?.length'>
        <span>{{ error }}</span>
    </div>
    <div v-else-if='directoryInfo'>
        <div>Directory ({{ $route.params.path }})</div>
        <div>{{ directoryInfo.path }}</div>
        <div>Directories:</div>
        <ul>
            <li :key='directory.path' v-for='directory in directoryInfo.directories'>
                <router-link :to='{ name: MUSIC, params: { [PATH]: directory.path } }'>
                    {{ directory.path }}
                </router-link>
            </li>
        </ul>
        <div>Tracks:</div>
        <ul>
            <li :key='track.path' v-for='track in directoryInfo.tracks' @click='() => onTrackClicked(track)'>
                {{ track.path }}
            </li>
        </ul>
    </div>
</template>

<style scoped></style>
