export function disconnectCategoryFromWatchesQuery(categoryIds: number[]):string{
    return `
        DELETE FROM _CategoryToWatch
        WHERE B IN (${categoryIds.join(',')});`;
}