export const clamp = (value: number | undefined, min: number, max: number) => {
    if (value === undefined) {
        return min;
    }

    return Math.max(min, Math.min(value, max))
};
