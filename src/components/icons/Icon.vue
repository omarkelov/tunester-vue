<script setup lang='ts'>

import { Icon as LucideIcon } from 'lucide-vue-next';
import { computed, ref, watchEffect } from 'vue';

import { combineClassNames } from '../../util/strings';


const props = defineProps<{
    icon: LucideIcon;
    size?: number;
    opacity?: number;
    filled?: boolean;
    thinBorder?: boolean;
    nonActionable?: boolean;
    borderColor?: string;
    fillColor?: string;
    borderColorHovered?: string;
    fillColorHovered?: string;
}>();

const isHoveredRef = ref<boolean>(false);
const colorRef = ref<string>(props.borderColor ?? '#d4d4d4');
const fillRef = ref<string | undefined>(props.filled ? (props.fillColor ?? '#d4d4d4') : undefined);

watchEffect(() => {
    colorRef.value = (
        isHoveredRef.value
            ? (props.borderColorHovered ?? '#f93358')
            : (props.borderColor ?? '#d4d4d4')
    );
});

watchEffect(() => {
    fillRef.value = props.filled
        ? ((
            isHoveredRef.value
                ? (props.fillColorHovered ?? '#fc4e6f')
                : (props.fillColor ?? '#d4d4d4')
        ))
        : undefined;
});

const classNames = computed(() => combineClassNames(
    !props.nonActionable && 'cursor-pointer hover:-mt-[1px] active:mt-0',
    props.thinBorder ? 'stroke-1' : 'stroke-2',
));

const onStarMouseEntered = () => {
    isHoveredRef.value = true;
};

const onStarMouseLeaved = () => {
    isHoveredRef.value = false;
};

</script>

<template>
    <component
        :is='icon'
        :class='classNames'
        :size='size ?? 24'
        :color='colorRef'
        :fill='fillRef'
        :opacity='opacity'
        v-on='nonActionable ? {} : {
            mouseenter: onStarMouseEntered,
            mouseleave: onStarMouseLeaved,
        }'
    />
</template>
