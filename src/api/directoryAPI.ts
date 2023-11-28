import { DIRECTORY_ADDRESS } from './constants';


export const fetchGetDirectory = (path: string, signal?: AbortSignal) =>
    fetch(encodeURI(`${DIRECTORY_ADDRESS}/${path}`), {
        method: 'GET',
        credentials: 'include',
        signal,
    });
