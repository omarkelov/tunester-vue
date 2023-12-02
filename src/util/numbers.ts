export const convertToPercent = (value: number) => Math.round(value * 100);

export const clamp = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) {
        return min;
    }

    return Math.max(min, Math.min(value, max))
};

export const roundUpTo = (value: number, p: number) => {
    return Math.round(value / p) * p;
};
