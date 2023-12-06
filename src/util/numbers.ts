export const convertToPercent = (value: number) => Math.round(value * 100);

export const clamp = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) {
        return min;
    }

    return Math.max(min, Math.min(value, max))
};

export const roundUpTo = (value: number, r?: number) => {
    if (!r) {
        return value;
    }

    return Math.round(value / r) * r;
};

export const getRandomInt = (min?: number, max?: number) => {
    min = Math.ceil(min ?? Number.MIN_SAFE_INTEGER);
    max = Math.floor(max ?? Number.MAX_SAFE_INTEGER);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};
