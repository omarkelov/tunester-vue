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
