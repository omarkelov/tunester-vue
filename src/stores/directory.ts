import { defineStore } from 'pinia';

import { fetchGetMusic } from '../api/musicAPI';
import { useFetching } from '../hooks/useFetching';
import { Directory } from '../util/types';


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
    id: 'directory',
    state: (): State => ({
        status: 'initial',
        directory: undefined,
        error: undefined,
    }),
    actions: {
        async loadDirectory(path: string, signal: AbortSignal) {
            this.$patch({ status: 'loading' });

            const { result, error } = await useFetching<Directory>(
                (signal: AbortSignal) => fetchGetMusic(path, signal),
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
                directory: result,
            });
        },
    },
});
