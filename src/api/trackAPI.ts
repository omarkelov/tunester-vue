import { TRACK_RATE_ADDRESS } from './constants';


export const fetchRateTrack = (path: string, rating: number, signal: AbortSignal) =>
    fetch(encodeURI(`${TRACK_RATE_ADDRESS}?trackPath=${path}&rating=${rating}`), {
        method: 'PATCH',
        credentials: 'include',
        signal,
    });
