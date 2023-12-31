import { defineStore } from 'pinia';

import { fetchGetDirectory } from '../api/directoryAPI';
import { handleFetching } from '../util/fetching';
import { Directory } from '../util/types';


const DIRECTORY_STORE_NAME = 'directory';

type InitialState = {
    status: 'initial';
    directory: undefined;
    error: undefined;
}

type SuccessState = {
    status: 'success';
    directory: Directory;
}

type LoadingState = {
    status: 'loading';
}

type ErrorState = {
    status: 'error';
    error: string;
}

type State = InitialState | SuccessState | LoadingState | ErrorState;

export const useDirectoryStore = defineStore({
    id: DIRECTORY_STORE_NAME,
    state: (): State => ({
        status: 'initial',
        directory: undefined,
        error: undefined,
    }),
    actions: {
        async loadDirectory(path: string, signal: AbortSignal) {
            this.$patch({ status: 'loading' });

            const { result: directory, error } = await handleFetching<Directory>(
                (signal: AbortSignal) => fetchGetDirectory(path, signal),
                signal,
            );

            if (error) {
                this.$patch({
                    status: 'error',
                    error
                });

                return;
            }

            this.$patch({
                status: 'success',
                directory,
            });
        },
    },
});
