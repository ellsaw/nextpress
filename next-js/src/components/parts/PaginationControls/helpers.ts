import { config } from "./PaginationControls";

export function getPreviousPageButtons(page: number) {
    const res: ({text: string|number, page?: number})[] = [];

    if (page - config.midSize > 1) {
        res.push({text: 1, page: 1});
    }

    for (let i = config.midSize; i > 0; i--) {
        if (page - i < 1) continue;
        if (i === config.midSize && page - config.midSize > 1) {
            res.push({text: '...'});
            continue;
        }

        const destinationPage = page - i;
        res.push({text: destinationPage, page: destinationPage});
    }
    return res;
}

export function getNextPageButtons(page: number, availablePages: number) {
    const res: ({text: string|number, page?: number})[] = [];

    for (let i = 1; i <= config.midSize; i++) {
        if (page + i >= availablePages) continue;
        if (i === config.midSize && availablePages - page > config.midSize) {
            res.push({text: '...'});
            continue;
        }

        const destinationPage = page + i;
        res.push({text: destinationPage, page: destinationPage});
    }

    console.log(page + config.midSize);

    if (page < availablePages) {
        res.push({text: availablePages, page: availablePages});
    }

    return res;
}
