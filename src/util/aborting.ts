const abortControllers : {
    [key: string]: Set<AbortController> | undefined;
} = {};

export const createAbortController = (groupName: string) => {
    const abortController = new AbortController();
    let abortControllersGroup = abortControllers[groupName];

    if (!abortControllersGroup) {
        abortControllersGroup = new Set();
        abortControllers[groupName] = abortControllersGroup;
    }

    abortControllersGroup.add(abortController);

    return abortController;
};

export const removeAbortController = (groupName: string, abortController: AbortController) =>
    abortControllers[groupName]?.delete(abortController);

export const abortGroupControllers = (groupName: string) => {
    const abortControllersGroup = abortControllers[groupName];

    if (!abortControllersGroup) {
        return;
    }

    for (const abortController of abortControllersGroup.values()) {
        abortController.abort();
    }

    abortControllersGroup.clear();
};
