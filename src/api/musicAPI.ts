import { MUSIC_ADDRESS } from './constants';


export const fetchGetMusic = (path: string, signal?: AbortSignal) =>
    fetch(encodeURI(`${MUSIC_ADDRESS}/${path}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });
