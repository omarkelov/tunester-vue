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
    if (props.isActionable && starIdx !== hoveredStarIdx.value) {
        hoveredStarIdx.value = starIdx;
    }
};

const onStarsMouseLeaved = () => {
    if (props.isActionable) {
        hoveredStarIdx.value = undefined;
    }
};

</script>

<template>
    <div
        class='flex'
        @mouseleave='onStarsMouseLeaved'
    >
        <Star
            filled
            :isSemiTransparent='!isActionable'
            v-for='i in filledStarsNumber'
            :key='i'
            @click='() => onStarClicked(i)'
            @mouseenter='() => onStarMouseEntered(i)'
        />
        <Star
            :isSemiTransparent='!isActionable'
            v-for='i in 5 - filledStarsNumber'
            :key='i + filledStarsNumber'
            @click='() => onStarClicked(i + filledStarsNumber)'
            @mouseenter='() => onStarMouseEntered(i + filledStarsNumber)'
        />
    </div>
</template>
