import { WatchOptions, ref, watch } from 'vue';


export const useFetching = <R>(
    fetchFn: (signal: AbortSignal) => Promise<Response>,
    source: Parameters<typeof watch>[0],
    options: WatchOptions = { immediate: true },
) => {
    const isLoading = ref<boolean>(true);
    const result = ref<R>();
    const error = ref<string>();

    const updateRefs = (_isLoading: boolean, _result?: R, _error?: string) => {
        isLoading.value = _isLoading;
        result.value = _result;
        error.value = _error;
    };

    watch(
        source,
        async (_value, _oldValue, onCleanup) => {
            setTimeout(() => updateRefs(true));

            const abortController = new AbortController();

            onCleanup(() => {
                updateRefs(false);
                abortController.abort();
            });

            try {
                const response = await fetchFn(abortController.signal);

                if (!response.ok) {
                    updateRefs(false, undefined, `Response not OK: status ${response.status}`);
                    return;
                }

                if (response.status === 204) {
                    return;
                }

                updateRefs(false, await response.json());
            } catch (e) {
                if (abortController.signal.aborted) {
                    return;
                }

                const errorMessage = JSON.stringify(e);
                const err = errorMessage.length && errorMessage !== '{}'
                    ? `Unexpected error (${errorMessage})`
                    : 'Unknown error';

                updateRefs(false, undefined, err);
            }
        },
        options
    );

    return { isLoading, result, error };
};
