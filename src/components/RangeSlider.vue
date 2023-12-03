<script lang='ts'>

export type UpdateValue = {
    value: number;
    isLastInARow: boolean;
}

</script>

<script setup lang='ts'>

import { ref } from 'vue';

import { clamp, roundUpTo } from '../util/numbers';


const props = defineProps<{
    value: number;
    step?: number;
}>();

const emit = defineEmits<{ (e: 'update', value: UpdateValue): void }>();

const isUserUpdatingRef = ref<boolean>(false);
const userValueRef = ref<number>(props.value);
const sliderRef = ref<HTMLDivElement>();

const onMouseDown = (event: MouseEvent) => {
    if (!sliderRef.value || event.button !== 0) {
        return;
    }

    const { pointerEvents, userSelect } = document.body.style;

    const updateValue = (event: MouseEvent, skipEmitting?: boolean) => {
        if (!sliderRef.value || event.button !== 0) {
            return;
        }

        const { left, width } = sliderRef.value.getBoundingClientRect();
        const value = clamp(roundUpTo((event.clientX - left) / width, props.step), 0, 1);

        if (userValueRef.value === value) {
            return;
        }

        userValueRef.value = value;

        if (!skipEmitting) {
            emit('update', {
                value: userValueRef.value,
                isLastInARow: false,
            });
        }
    };

    const onMouseUp = (event: MouseEvent) => {
        if (event.button !== 0) {
            return;
        }

        updateValue(event, true);

        window.removeEventListener('mousemove', updateValue);
        window.removeEventListener('mouseup', onMouseUp);

        document.body.style.pointerEvents = pointerEvents;
        document.body.style.userSelect = userSelect;
        isUserUpdatingRef.value = false;

        emit('update', {
            value: userValueRef.value,
            isLastInARow: true,
        });
    };

    document.body.style.pointerEvents = 'none';
    document.body.style.userSelect = 'none';

    isUserUpdatingRef.value = true;
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
                :style='`width: ${(isUserUpdatingRef ? userValueRef : value) * 100}%;`'
            ></div>
            <div
                class='h-full bg-neutral-600'
                :style='`width: ${(1 - (isUserUpdatingRef ? userValueRef : value)) * 100}%;`'
            ></div>
        </div>
    </div>
</template>
