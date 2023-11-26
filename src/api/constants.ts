const PROTOCOL = 'http';
const HOSTNAME = location?.hostname || 'localhost';
const PORT = '8081';

export const SERVER_ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const LOGIN = '/api/login';
const LOGOUT = '/api/logout';

const MUSIC = '/api/music';

export const LOGIN_ADDRESS = `${SERVER_ADDRESS}${LOGIN}`;
export const LOGOUT_ADDRESS = `${SERVER_ADDRESS}${LOGOUT}`;

export const MUSIC_ADDRESS = `${SERVER_ADDRESS}${MUSIC}`;
