<script setup lang='ts'>

import { computed, ref } from 'vue';

import { clamp, roundUpTo } from '../util/numbers';


const props = defineProps<{
    initialValue: number;
    step?: number;
}>();

const emit = defineEmits<{ (e: 'update', value: number): void }>();

const stepRef = computed(() => props.step ?? .05);
const valueRef = ref<number>(props.initialValue);
const sliderRef = ref<HTMLDivElement>();

const onMouseDown = (event: MouseEvent) => {
    if (!sliderRef.value) {
        return;
    }

    const { pointerEvents, userSelect } = document.body.style;

    const updateValue = ({ clientX }: MouseEvent) => {
        if (!sliderRef.value) {
            return;
        }

        const { left, width } = sliderRef.value.getBoundingClientRect();
        const value = clamp(roundUpTo((clientX - left) / width, stepRef.value), 0, 1);

        if (valueRef.value === value) {
            return;
        }

        valueRef.value = value;
        emit('update', valueRef.value);
    };

    const onMouseUp = (event: MouseEvent) => {
        updateValue(event);

        window.removeEventListener('mousemove', updateValue);
        window.removeEventListener('mouseup', onMouseUp);

        document.body.style.pointerEvents = pointerEvents;
        document.body.style.userSelect = userSelect;
    };

    document.body.style.pointerEvents = 'none';
    document.body.style.userSelect = 'none';

    updateValue(event);
    window.addEventListener('mousemove', updateValue);
    window.addEventListener('mouseup', onMouseUp);
};

</script>

<template>
    <div
        ref='sliderRef'
        class='py-[13px] w-full cursor-pointer'
        @mousedown='onMouseDown'
    >
        <div
            class='w-full h-2 flex'
            style='clip-path: inset(0% 0% round 9999px)'
        >
            <div
                class='h-full bg-neutral-300'
                :style='`width: ${Math.round(valueRef * 100)}%`'
            ></div>
            <div
                class='h-full bg-neutral-600'
                :style='`width: ${Math.round((1 - valueRef) * 100)}%`'
            ></div>
        </div>
    </div>
</template>
