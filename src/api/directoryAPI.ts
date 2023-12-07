import { DIRECTORY_ADDRESS, DIRECTORY_NEXT_ADDRESS, DIRECTORY_PREVIOUS_ADDRESS } from './constants';


export const fetchGetDirectory = (path: string, signal?: AbortSignal) =>
    fetch(encodeURI(`${DIRECTORY_ADDRESS}/${path}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });

export const fetchGetPreviousDirectory = (path: string, rating: number, signal: AbortSignal) =>
    fetch(encodeURI(`${DIRECTORY_PREVIOUS_ADDRESS}?directoryPath=${path}&rating=${rating}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });

export const fetchGetNextDirectory = (path: string, rating: number, signal: AbortSignal) =>
    fetch(encodeURI(`${DIRECTORY_NEXT_ADDRESS}?directoryPath=${path}&rating=${rating}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });
