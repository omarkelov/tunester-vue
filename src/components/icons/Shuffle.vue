<script lang='ts'>

export enum ShuffleState {
    NO = 'NO',
    SHUFFLE_DIRECTORY = 'SHUFFLE_DIRECTORY',
    SHUFFLE_GLOBALLY = 'SHUFFLE_GLOBALLY',
};

</script>

<script setup lang='ts'>

import { Dices, Shuffle } from 'lucide-vue-next';

import Icon from './Icon.vue';


defineProps<{
    shuffleState: ShuffleState;
}>();

</script>

<template>
    <Icon
        :icon='shuffleState === ShuffleState.SHUFFLE_GLOBALLY ? Dices : Shuffle'
        :thin-border='shuffleState === ShuffleState.NO'
        :border-color='shuffleState !== ShuffleState.NO ? "#f93358" : undefined'
    />
</template>
