<script setup lang='ts'>

import { Star } from 'lucide-vue-next';


defineProps<{
    filled?: boolean;
    isSemiTransparent: boolean;
}>();

const borderColor = '#f93358';
const fillColor = '#fc4e6f';

</script>

<template>
    <Star
        class='stroke-1 cursor-pointer'
        :color='borderColor'
        :fill='filled ? fillColor : undefined'
        :opacity='isSemiTransparent ? 0.5 : 1'
        :size='32'
    />
</template>
