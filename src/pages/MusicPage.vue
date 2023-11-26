<script setup lang='ts'>

import { ref } from 'vue';

import { fetchRateTrack } from '../api/trackAPI';
import Directory from '../components/Directory.vue';
import NavBar from '../components/NavBar.vue';
import Player from '../components/Player.vue';
import { useAbortController } from '../hooks/useAbortController';
import { useFetching } from '../hooks/useFetching';
import { Track, TrackDeepRating } from '../util/types';


const track = ref<Track>();

const abortController = useAbortController();

const onTrackRated = async (rating: number) => {
    if (!track.value) {
        return;
    }

    const trackPath = track.value.path;
    const { error } = await useFetching(
        (signal: AbortSignal) => fetchRateTrack(trackPath, rating, signal),
        abortController.signal,
    );

    if (error) {
        console.log(error);
        return;
    }

    const trackDeepRating: TrackDeepRating = { meta: { comment: { rating } } };

    Object.assign(track.value, trackDeepRating);
};

</script>

<template>
    <NavBar />
    <Directory @play-track='t => track = t' />
    <Player
        :track='track'
        v-on:rate='onTrackRated'
    />
</template>
