<script setup lang='ts'>

import { Star } from 'lucide-vue-next';


defineProps<{
    filled?: boolean;
    isSemiTransparent: boolean;
}>();

</script>

<template>
    <Star
        class='stroke-1 cursor-pointer'
        color='#f93358'
        :fill='filled ? "#fc4e6f" : undefined'
        :opacity='isSemiTransparent ? 0.5 : 1'
        :size='32'
    />
</template>
