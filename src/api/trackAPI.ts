import { TRACK_NEXT_RANDOM_ADDRESS, TRACK_PREVIOUS_RANDOM_ADDRESS, TRACK_RATE_ADDRESS } from './constants';


export const fetchRateTrack = (path: string, rating: number, signal: AbortSignal) =>
    fetch(encodeURI(`${TRACK_RATE_ADDRESS}?trackPath=${path}&rating=${rating}`), {
        method: 'PATCH',
        credentials: 'include',
        signal,
    });

export const fetchGetPreviousRandomTrack = (path: string, rating: number, seed: number, signal: AbortSignal) =>
    fetch(encodeURI(`${TRACK_PREVIOUS_RANDOM_ADDRESS}?trackPath=${path}&rating=${rating}&seed=${seed}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });

export const fetchGetNextRandomTrack = (path: string, rating: number, seed: number, signal: AbortSignal) =>
    fetch(encodeURI(`${TRACK_NEXT_RANDOM_ADDRESS}?trackPath=${path}&rating=${rating}&seed=${seed}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });
