import { LOGIN_ADDRESS, LOGOUT_ADDRESS } from './constants';

import { Credentials } from '../util/types';


export const fetchLogin = (credentials: Credentials, signal: AbortSignal) =>
    fetch(`${LOGIN_ADDRESS}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
        signal,
    });

export const fetchLogout = (signal: AbortSignal) =>
    fetch(`${LOGOUT_ADDRESS}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        signal,
    });
