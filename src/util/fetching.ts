type FetchResult<R> = {
    result?: R;
    error?: string;
}

export const handleFetching = async <R>(
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
