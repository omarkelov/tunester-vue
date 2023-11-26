<script setup lang='ts'>

import { Star } from 'lucide-vue-next';


defineProps<{ filled?: boolean }>();

const borderColor = '#f93358';
const fillColor = '#fc4e6f';

</script>

<template>
    <Star
        class='stroke-1 cursor-pointer'
        :color='borderColor'
        :fill='filled ? fillColor : undefined'
        :size='32'
    />
</template>
