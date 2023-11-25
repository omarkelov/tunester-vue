<script setup lang='ts'>

import { computed } from 'vue';

import { SERVER_ADDRESS } from '../api/constants';
import { Track } from '../util/types';


const props = defineProps<{
    track?: Track;
}>();

const trackSrc = computed(
    () => props.track
        ? encodeURI(`${SERVER_ADDRESS}/api/track/${props.track.path}`)
        : undefined
);

</script>

<template>
    <div class='fixed bottom-0 w-full'>
        <audio
            v-if='trackSrc'
            class='w-full'
            :src='trackSrc'
            crossOrigin='use-credentials'
            controls
            autoplay
        ></audio>
    </div>
</template>
