export const shuffle = <T>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
};

export const shuffleWithSeed = <T>(arr: T[], seed: number) => {
    const getNextRandom = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(getNextRandom() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
};

export const rotate = <T>(arr: T[], k: number) => {
    if (k < 0) {
        k = (k % arr.length) + arr.length;
    }

    const arrCopy = [...arr];

    for (let i = 0; i < arr.length; i++) {
        arr[(i + k) % arr.length] = arrCopy[i];
    }

    return arr;
};
