export interface IQueryParams {
    pageNumber: number|null;
    pageSize: number|null;
    filters: {
        fieldName: string;
        value: string;
    }[]|null;
    sortOrders: {
        fieldName: string;
        value: string;
    }[]|null;
};