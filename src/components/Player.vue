<script setup lang='ts'>

import { onMounted, onUnmounted, onUpdated, ref } from 'vue';

import { usePlayerStore } from '../stores/player';
import { clamp, convertToPercent } from '../util/numbers';
import { convertTime, trimFileExtension } from '../util/strings';

import Music from './icons/Music.vue';
import Next from './icons/Next.vue';
import Previous from './icons/Previous.vue';
import Refresh from './icons/Refresh.vue';
import Repeat from './icons/Repeat.vue';
import PlayOrPause from './icons/PlayOrPause.vue';
import Shuffle from './icons/Shuffle.vue';
import Stop from './icons/Stop.vue';
import RangeSlider, { UpdateValue } from './RangeSlider.vue';
import Rating from './Rating.vue';


const emit = defineEmits<{ (e: 'onWrapperHeightUpdated', height?: number): void }>();
const wrapperRef = ref<HTMLDivElement>();

onUpdated(() => emit('onWrapperHeightUpdated', wrapperRef.value?.getBoundingClientRect().height));

const playerStore = usePlayerStore();
const audioRef = ref<HTMLAudioElement>();

onMounted(() => playerStore.setAudioElement(audioRef.value));
onUnmounted(() => playerStore.dispose());

const onTimeUpdated = ({ value, isLastInARow }: UpdateValue) => {
    if (!isLastInARow) {
        return;
    }

    playerStore.seek(value);
};

const onVolumeUpdated = ({ value }: UpdateValue) => playerStore.setVolume(value);
const onStopClicked = () => playerStore.stop();
const onReplayClicked = () => playerStore.replay();
const onPlayOrPauseClicked = () => playerStore.toggle();
const onPreviousClicked = () => playerStore.playPrevious();
const onNextClicked = () => playerStore.playNext();
const onShuffleClicked = () => playerStore.switchShuffleState();
const onRepeatClicked = () => playerStore.switchRepeatState();

</script>

<template>
    <div
        ref='wrapperRef'
        class='fixed bottom-0 w-full flex flex-col gap-2 items-center'
    >
        <p v-if='playerStore.isTrackBeingRated'>Loading...</p>
        <audio
            class='w-full'
            ref='audioRef'
            crossOrigin='use-credentials'
        ></audio>
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
                    v-on:rate='rating => playerStore.rateTrack(rating)'
                />
            </div>
            <div class='w-full flex gap-5'>
                <div class='flex gap-2 items-center'>
                    <Stop @click='onStopClicked' />
                    <Refresh @click='onReplayClicked' />
                    <PlayOrPause
                        :is-playing='playerStore.isPlaying'
                        @click='onPlayOrPauseClicked'
                    />
                    <Previous @click='onPreviousClicked' />
                    <Next @click='onNextClicked' />
                </div>
                <div class='w-full flex gap-1 items-center'>
                    <RangeSlider
                        :value='playerStore.time'
                        v-on:update='onTimeUpdated'
                    />
                    <div class='mb-0.5 shrink-0'>
                        <span
                            v-if='playerStore.time * playerStore.duration < 600'
                            class='invisible pointer-events-none'
                        >1</span>
                        <span>{{ convertTime(playerStore.time * playerStore.duration) }}</span>
                        <span> / </span>
                        <span>{{ convertTime(playerStore.duration) }}</span>
                    </div>
                </div>
                <div class='ml-auto flex gap-5 items-center'>
                    <div class='flex gap-2 items-center'>
                        <Shuffle
                            :shuffle-state='playerStore.shuffleState'
                            @click='onShuffleClicked'
                        />
                        <Repeat
                            :repeat-state='playerStore.repeatState'
                            @click='onRepeatClicked'
                        />
                    </div>
                    <div class='flex gap-1 items-center'>
                        <div class='w-20'>
                            <RangeSlider
                                :value='playerStore.volume'
                                v-on:update='onVolumeUpdated'
                                :step='.05'
                            />
                        </div>
                        <div>
                            <span
                                v-if='convertToPercent(playerStore.volume) < 10'
                                class='invisible pointer-events-none'
                            >10</span>
                            <span
                                v-else-if='convertToPercent(playerStore.volume) < 100'
                                class='invisible pointer-events-none'
                            >1</span>
                            <span class='mb-0.5'>{{ convertToPercent(playerStore.volume) }}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
