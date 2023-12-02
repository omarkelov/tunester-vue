<script setup lang='ts'>

import { computed, ref } from 'vue';

import Star from './icons/Star.vue';


const props = defineProps<{
    rating: number;
    isActionable: boolean;
}>();
const emit = defineEmits<{ (e: 'rate', rating: number): void }>();

const hoveredStarIdx = ref<number>();
const filledStarsNumber = computed(() => hoveredStarIdx.value ?? props.rating);

const onStarClicked = (starIdx: number) => {
    if (props.isActionable) {
        emit('rate', starIdx);
    }
};

const onStarMouseEntered = (starIdx: number) => {
    if (props.isActionable) {
        hoveredStarIdx.value = starIdx;
    }
};

const onStarMouseLeaved = () => {
    if (props.isActionable) {
        hoveredStarIdx.value = undefined;
    }
};

</script>

<template>
    <div class='flex'>
        <Star
            filled
            :isSemiTransparent='!isActionable'
            v-for='i in filledStarsNumber'
            :key='i'
            @click='() => onStarClicked(i)'
            @mouseenter='() => onStarMouseEntered(i)'
            @mouseleave='onStarMouseLeaved'
        />
        <Star
            :isSemiTransparent='!isActionable'
            v-for='i in 5 - filledStarsNumber'
            :key='i + filledStarsNumber'
            @click='() => onStarClicked(i + filledStarsNumber)'
            @mouseenter='() => onStarMouseEntered(i + filledStarsNumber)'
            @mouseleave='onStarMouseLeaved'
        />
    </div>
</template>
