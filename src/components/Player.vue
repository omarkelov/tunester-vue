<script setup lang='ts'>

import { computed } from 'vue';

import { SERVER_ADDRESS } from '../api/constants';
import { clamp } from '../util/numbers';
import { Track } from '../util/types';

import Rating from './Rating.vue';


const props = defineProps<{ track?: Track }>();
const emit = defineEmits<{ (e: 'rate', rating: number): void }>();

const trackSrc = computed(
    () => props.track
        ? encodeURI(`${SERVER_ADDRESS}/api/track/${props.track.path}`)
        : undefined
);

const trackRating = computed(
    () => props.track
        ? props.track?.meta.comment?.rating
        : undefined
);

</script>

<template>
    <div class='fixed bottom-0 flex flex-col gap-2 items-center w-full'>
        <p>Track path: {{ track?.path }}</p>
        <Rating
            :rating='clamp(trackRating, 0, 5)'
            v-on:rate='rating => emit("rate", rating)'
        />
        <audio
            class='w-full'
            :src='trackSrc'
            crossOrigin='use-credentials'
            controls
            autoplay
        ></audio>
    </div>
</template>
