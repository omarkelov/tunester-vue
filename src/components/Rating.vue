<script setup lang='ts'>

import { computed, ref } from 'vue';

import Star from './Star.vue';


const props = defineProps<{ rating: number }>();
const emit = defineEmits<{ (e: 'rate', rating: number): void }>();

const hoveredStarIdx = ref<number>();
const filledStarsNumber = computed(() => hoveredStarIdx.value ?? props.rating);

const onStarMouseEntered = (starIdx: number) => {
    hoveredStarIdx.value = starIdx;
};

const onStarMouseLeaved = () => {
    hoveredStarIdx.value = undefined;
};

</script>

<template>
    <div class='flex'>
        <Star
            filled
            v-for='i in filledStarsNumber'
            :key='i'
            @click='() => emit("rate", i)'
            @mouseenter='() => onStarMouseEntered(i)'
            @mouseleave='onStarMouseLeaved'
        />
        <Star
            v-for='i in 5 - filledStarsNumber'
            :key='i + filledStarsNumber'
            @click='() => emit("rate", i + filledStarsNumber)'
            @mouseenter='() => onStarMouseEntered(i + filledStarsNumber)'
            @mouseleave='onStarMouseLeaved'
        />
    </div>
</template>
