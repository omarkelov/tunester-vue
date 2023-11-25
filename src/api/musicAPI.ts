import { MUSIC_ADDRESS } from './constants';


export const fetchGetMusic = (path: string, signal?: AbortSignal) =>
    fetch(`${MUSIC_ADDRESS}/${path}`, {
        method: 'GET',
        credentials: 'include',
        signal,
    });
