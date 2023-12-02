<script setup lang='ts'>

import { Pause, Play } from 'lucide-vue-next';

import Icon from './Icon.vue';


defineProps<{
    isPlaying: boolean;
}>();

</script>

<template>
    <Icon
        :icon='isPlaying ? Pause : Play'
        filled
        :thin-border='isPlaying'
    />
</template>
