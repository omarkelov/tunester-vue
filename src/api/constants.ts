const PROTOCOL = 'http';
const HOSTNAME = location?.hostname || 'localhost';
const PORT = '8081';

export const SERVER_ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const LOGIN = '/api/login';
const LOGOUT = '/api/logout';

const DIRECTORY = '/api/directory';
const TRACK = '/api/track';
const TRACK_RATE = `${TRACK}/rate`;

export const LOGIN_ADDRESS = `${SERVER_ADDRESS}${LOGIN}`;
export const LOGOUT_ADDRESS = `${SERVER_ADDRESS}${LOGOUT}`;

export const DIRECTORY_ADDRESS = `${SERVER_ADDRESS}${DIRECTORY}`;
export const TRACK_RATE_ADDRESS = `${SERVER_ADDRESS}${TRACK_RATE}`;
