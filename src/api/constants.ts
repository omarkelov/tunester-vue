const PROTOCOL = 'http';
const HOSTNAME = location?.hostname || 'localhost';
const PORT = '8081';

export const SERVER_ADDRESS = `${PROTOCOL}://${HOSTNAME}:${PORT}`;

const LOGIN = '/api/login';
const LOGOUT = '/api/logout';

const DIRECTORY = '/api/directory';
const DIRECTORY_PREVIOUS = `${DIRECTORY}/previous`;
const DIRECTORY_NEXT = `${DIRECTORY}/next`;

const TRACK = '/api/track';
const TRACK_RATE = `${TRACK}/rate`;
const TRACK_PREVIOUS_RANDOM = `${TRACK}/previous-random`;
const TRACK_NEXT_RANDOM = `${TRACK}/next-random`;

export const LOGIN_ADDRESS = `${SERVER_ADDRESS}${LOGIN}`;
export const LOGOUT_ADDRESS = `${SERVER_ADDRESS}${LOGOUT}`;

export const DIRECTORY_ADDRESS = `${SERVER_ADDRESS}${DIRECTORY}`;
export const DIRECTORY_PREVIOUS_ADDRESS = `${SERVER_ADDRESS}${DIRECTORY_PREVIOUS}`;
export const DIRECTORY_NEXT_ADDRESS = `${SERVER_ADDRESS}${DIRECTORY_NEXT}`;

export const TRACK_RATE_ADDRESS = `${SERVER_ADDRESS}${TRACK_RATE}`;
export const TRACK_PREVIOUS_RANDOM_ADDRESS = `${SERVER_ADDRESS}${TRACK_PREVIOUS_RANDOM}`;
export const TRACK_NEXT_RANDOM_ADDRESS = `${SERVER_ADDRESS}${TRACK_NEXT_RANDOM}`;
