import { Directory } from './types';


export const combineClassNames = (...classNames: (string | false | undefined)[]) =>
    classNames.filter(className => !!className).join(' ') as string;

export const trimPathPrefix = (str: string) => {
    const lastSlashIdx = str.lastIndexOf('/');

    return lastSlashIdx >= 0
        ? str.slice(lastSlashIdx + 1)
        : str;
};

export const trimFileExtension = (str?: string) => {
    if (!str) {
        return str;
    }

    const lastDotIdx = str.lastIndexOf('.');

    return lastDotIdx >= 0
        ? str.slice(0, lastDotIdx)
        : str;
};

export const convertTime = (seconds?: number) => {
    if (!seconds) {
        return '0:00';
    }

    const time = new Date(seconds * 1000)
        .toISOString()
        .substring(seconds < 3600 ? 14 : 11, 19);

    return time[0] === '0'
        ? time.substring(1)
        : time;
};

export const convertISODateToLocaleString = (isoDate: string) => {
    const date = new Date(isoDate);

    return `${date.toLocaleDateString('ru-RU')} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
};

export const convertBitrate = (bitrate?: number) => bitrate === undefined
    ? ''
    : `${(bitrate * 0.0009765625).toFixed(0)} kb/s`;

export const convertBytesToMegabytes = (size?: number) => size === undefined
    ? ''
    : `${+(size * 0.00000095367431640625).toFixed(2)} Mb`;

export const convertRatingCountByRating = (ratingCountByRating: Directory['ratingCountByRating']) => {
    const { ratingSum, countSum, withoutRatingCount } = Object.entries(ratingCountByRating).reduce((acc, [rating, count]) => {
        if (rating === '-1') {
            acc.withoutRatingCount = count;
        } else {
            acc.ratingSum += parseInt(rating) * count;
            acc.countSum += count;
        }

        return acc;
    }, {
        withoutRatingCount: 0,
        ratingSum: 0,
        countSum: 0,
    });

    return `${+(ratingSum / countSum || 0).toFixed(2)} (+${withoutRatingCount})`;
};
