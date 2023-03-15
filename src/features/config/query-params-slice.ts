export interface IQueryParams {
    pageNumber: number|null;
    pageSize: number|null;
    filter: {
        fieldName: string;
        value: string;
    }[]|null;
    sortBy: {
        fieldName: string;
        value: string;
    }[]|null;
};