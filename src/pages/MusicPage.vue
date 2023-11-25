<script setup lang='ts'>

import { ref } from 'vue';

import Directory from '../components/Directory.vue';
import NavBar from '../components/NavBar.vue';
import Player from '../components/Player.vue';
import { Track } from '../util/types';


const track = ref<Track>();

</script>

<template>
    <NavBar />
    <Directory @play-track='t => track = t' />
    <Player :track='track' />
</template>
