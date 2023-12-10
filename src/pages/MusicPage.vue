<script setup lang='ts'>

import { ref } from 'vue';

import Directory from '../features/directory/Directory.vue';
import NavBar from '../features/navbar/NavBar.vue';
import Player from '../features/player/Player.vue';

const playerWrapperHeightRef = ref<number>();

const handleWrapperHeightUpdate = (height?: number) => {
    playerWrapperHeightRef.value = height;
};

</script>

<template>
    <NavBar />
    <Directory :style='`margin-bottom: ${playerWrapperHeightRef === undefined ? 0 : playerWrapperHeightRef + 10}px;`' />
    <Player v-on:on-wrapper-height-updated='handleWrapperHeightUpdate' />
</template>
