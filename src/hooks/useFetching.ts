import { WatchOptions, ref, watch } from 'vue';


type FetchResult<R> = {
    result?: R;
    error?: string;
}

export const useFetching = async <R>(
    fetchFn: (signal: AbortSignal) => Promise<Response>,
    signal: AbortSignal,
): Promise<FetchResult<R>> => {
    try {
        const response = await fetchFn(signal);

        if (!response.ok) {
            return {
                error: `Response not OK: status ${response.status}`
            };
        }

        if (response.status === 204) {
            return {};
        }

        return {
            result: await response.json()
        };
    } catch (e) {
        if (signal.aborted) {
            return {};
        }

        const errorMessage = JSON.stringify(e);

        return {
            error: errorMessage.length && errorMessage !== '{}'
                ? `Unexpected error (${errorMessage})`
                : 'Unknown error'
        };
    }
};

export const useWatchFetching = <R>(
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

            const { result, error } = await useFetching<R>(fetchFn, abortController.signal);

            updateRefs(false, result, error);
        },
        options
    );

    return { isLoading, result, error };
};
