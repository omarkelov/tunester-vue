<script setup lang='ts'>

import { onMounted, ref } from 'vue';

import { SERVER_ADDRESS } from '../api/constants';
import { useAbortController } from '../hooks/useAbortController';
import { usePlayerStore } from '../stores/player';
import { clamp } from '../util/numbers';

import Rating from './Rating.vue';


const { signal } = useAbortController();
const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement>();

onMounted(() => {
    if (audioRef.value) {
        audioRef.value.volume = 0.1;
    }
});

</script>

<template>
    <div class='fixed bottom-0 flex flex-col gap-2 items-center w-full'>
        <p v-if='playerStore.isTrackBeingRated'>Loading...</p>
        <p>Rating: {{ playerStore.track?.meta.comment?.rating }}</p>
        <p>isTrackBeingRated: {{ playerStore.isTrackBeingRated }}</p>
        <p>Track path: {{ playerStore.track?.path }}</p>
        <Rating
            :rating='clamp(playerStore.track?.meta.comment?.rating, 0, 5)'
            :isActionable='!playerStore.isTrackBeingRated'
            v-on:rate='rating => playerStore.rateTrack(rating, signal)'
        />
        <audio
            class='w-full'
            ref='audioRef'
            :src='playerStore.track ? encodeURI(`${SERVER_ADDRESS}/api/track/${playerStore.track?.path}`) : undefined'
            crossOrigin='use-credentials'
            controls
            autoplay
        ></audio>
    </div>
</template>
