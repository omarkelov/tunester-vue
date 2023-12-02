<script lang='ts'>

export enum RepeatState {
    NO = 'NO',
    CYCLE = 'CYCLE',
    SINGLE = 'SINGLE',
};

</script>

<script setup lang='ts'>

import { Repeat, Repeat1 } from 'lucide-vue-next';

import Icon from './Icon.vue';


defineProps<{
    repeatState: RepeatState;
}>();

</script>

<template>
    <Icon
        :icon='repeatState === RepeatState.SINGLE ? Repeat1 : Repeat'
        :thin-border='repeatState === RepeatState.NO'
        :border-color='repeatState !== RepeatState.NO ? "#f93358" : undefined'
    />
</template>
