import { IFilter } from "./filter";
import { ISortOrder } from "./sort-order";

export interface IQueryParamFilters {
    pageNumber: number|null;
    pageSize: number|null;
    filters: IFilter[]|null;
    sortOrders: ISortOrder[]|null;
};

export type qFilters = Pick<IQueryParamFilters, "filters">;