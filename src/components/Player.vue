<script setup lang='ts'>

import { watchEffect, ref } from 'vue';

import { SERVER_ADDRESS } from '../api/constants';
import { useAbortController } from '../hooks/useAbortController';
import { usePlayerStore } from '../stores/player';
import { clamp, convertToPercent } from '../util/numbers';
import { trimFileExtension } from '../util/strings';

import Music from './icons/Music.vue';
import Next from './icons/Next.vue';
import Previous from './icons/Previous.vue';
import Refresh from './icons/Refresh.vue';
import Repeat, { RepeatState } from './icons/Repeat.vue';
import PlayOrPause from './icons/PlayOrPause.vue';
import Shuffle, { ShuffleState } from './icons/Shuffle.vue';
import Stop from './icons/Stop.vue';
import RangeSlider from './RangeSlider.vue';
import Rating from './Rating.vue';


const initialTime = 0;
const initialVolume = 0.5;

const { signal } = useAbortController();
const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement>();
const volumeRef = ref<number>(initialVolume);
const isPlayingRef = ref<boolean>(false);
const shuffleStateRef = ref<ShuffleState>(ShuffleState.NO);
const repeatStateRef = ref<RepeatState>(RepeatState.NO);

watchEffect(() => {
    if (audioRef.value) {
        audioRef.value.volume = volumeRef.value / 2;
    }
});

const onTimeUpdated = (value: number) => {

};

const onVolumeUpdated = (value: number) => {
    volumeRef.value = value;
};

const onStopClicked = () => {
    if (!audioRef.value) {
        return;
    }

    isPlayingRef.value = false;
    audioRef.value.currentTime = 0;
    audioRef.value.pause();
};

const onReplayClicked = () => {
    if (!audioRef.value) {
        return;
    }

    isPlayingRef.value = true;
    audioRef.value.currentTime = 0;
    audioRef.value.play();
};

const onPlayOrPauseClicked = () => {
    if (!audioRef.value) {
        return;
    }

    isPlayingRef.value = !isPlayingRef.value;

    if (isPlayingRef.value) {
        audioRef.value.play();
    } else {
        audioRef.value.pause();
    }
};

const onPreviousClicked = () => {

};

const onNextClicked = () => {

};

const onShuffleClicked = () => {
    shuffleStateRef.value = (() => {
        switch (shuffleStateRef.value) {
            case ShuffleState.NO:
                return ShuffleState.SHUFFLE_DIRECTORY;
            case ShuffleState.SHUFFLE_DIRECTORY:
                return ShuffleState.SHUFFLE_GLOBALLY;
            case ShuffleState.SHUFFLE_GLOBALLY:
                return ShuffleState.NO;
        }
    })();
};

const onRepeatClicked = () => {
    repeatStateRef.value = (() => {
        switch (repeatStateRef.value) {
            case RepeatState.NO:
                return RepeatState.CYCLE;
            case RepeatState.CYCLE:
                return RepeatState.SINGLE;
            case RepeatState.SINGLE:
                return RepeatState.NO;
        }
    })();
};

</script>

<template>
    <div class='fixed bottom-0 w-full flex flex-col gap-2 items-center'>
        <p v-if='playerStore.isTrackBeingRated'>Loading...</p>
        <audio
            class='w-full'
            ref='audioRef'
            :src='playerStore.track ? encodeURI(`${SERVER_ADDRESS}/api/track/${playerStore.track?.path}`) : undefined'
            crossOrigin='use-credentials'
            controls
        ></audio>
        <div class='mt-10'><!-- REMOVE --></div>
        <div class='p-4 pb-3 w-full flex flex-col gap-3 bg-neutral-900'>
            <div class='flex gap-3 justify-center items-center'>
                <Music
                    color='#d4d4d4'
                    :size='32'
                />
                <span>{{ trimFileExtension(playerStore.track?.meta.filename) }}</span>
                <Rating
                    :rating='clamp(playerStore.track?.meta.comment?.rating, 0, 5)'
                    :isActionable='!playerStore.isTrackBeingRated'
                    v-on:rate='rating => playerStore.rateTrack(rating, signal)'
                />
            </div>
            <div class='w-full flex gap-5'>
                <div class='flex gap-2 items-center'>
                    <Stop @click='onStopClicked' />
                    <Refresh @click='onReplayClicked' />
                    <PlayOrPause
                        :is-playing='isPlayingRef'
                        @click='onPlayOrPauseClicked'
                    />
                    <Previous @click='onPreviousClicked' />
                    <Next @click='onNextClicked' />
                </div>
                <div class='w-full flex gap-3 items-center'>
                    <RangeSlider
                        :initial-value='initialTime'
                        v-on:update='onTimeUpdated'
                        :step='.005'
                    />
                    <div class='mb-0.5 shrink-0'>
                        <span>0:00</span>
                        <span> / </span>
                        <span>4:25</span>
                    </div>
                </div>
                <div class='ml-auto flex gap-5 items-center'>
                    <div class='flex gap-2 items-center'>
                        <Shuffle
                            :shuffle-state='shuffleStateRef'
                            @click='onShuffleClicked'
                        />
                        <Repeat
                            :repeat-state='repeatStateRef'
                            @click='onRepeatClicked'
                        />
                    </div>
                    <div class='flex gap-1 items-center'>
                        <div class='w-20'>
                            <RangeSlider
                                :initial-value='initialVolume'
                                v-on:update='onVolumeUpdated'
                            />
                        </div>
                        <div>
                            <span
                                v-if='convertToPercent(volumeRef) < 10'
                                class='invisible pointer-events-none'
                            >10</span>
                            <span
                                v-else-if='convertToPercent(volumeRef) < 100'
                                class='invisible pointer-events-none'
                            >1</span>
                            <span class='mb-0.5'>{{ convertToPercent(volumeRef) }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
