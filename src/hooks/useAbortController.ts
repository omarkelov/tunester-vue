import { onUnmounted, ref } from 'vue';


export const useAbortController = (): AbortController => {
    const abortControllerRef = ref<AbortController>(new AbortController());

    onUnmounted(() => {
        abortControllerRef.value.abort();
    });

    return abortControllerRef.value;
};
