export const combineClassNames = (...classNames: (string | false | undefined)[]) =>
    classNames.filter(className => !!className).join(' ') as string;

export const trimFileExtension = (str?: string) => {
    if (!str) {
        return str;
    }

    const lastDotIdx = str.lastIndexOf('.');

    return lastDotIdx >= 0
        ? str.slice(0, lastDotIdx)
        : str;
};

export const convertTime = (seconds: number) => {
    const time = new Date(seconds * 1000)
        .toISOString()
        .substring(seconds < 3600 ? 14 : 11, 19);

    return time[0] === '0'
        ? time.substring(1)
        : time;
};
