import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

export interface IStatusFlowLog {
    id: string|null;
    nama: string|null;
};

type daftarStatusFlowLog = IStatusFlowLog[];

export const StatusFlowLogApiSlice = createApi({
    reducerPath: 'statusFlowLogApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['StatusFlowLog'],
    endpoints(builder) {
        return {
            addStatusFlowLog: builder.mutation<IStatusFlowLog, Partial<IStatusFlowLog>>({
                query: (body) => ({
                    url: 'status_flow_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'StatusFlowLog', id: 'LIST'}],
            }),
            updateStatusFlowLog: builder.mutation<void, Partial<IStatusFlowLog>>({
                query: (perusahaan) => ({
                    url: 'status_flow_log',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'StatusFlowLog', id: id!}];
                },
            }),
            deleteStatusFlowLog: builder.mutation<{ success: boolean; id: string }, string>({
                query(idStatusFlowLog) {
                  return {
                    url: `status_flow_log/${idStatusFlowLog}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idStatusFlowLog) => {
                    return [{type: 'StatusFlowLog', id: idStatusFlowLog}]
                },
            }),
            getDaftarStatusFlowLogByFilters: builder.query<daftarStatusFlowLog, IQueryParams>({
                query: (queryParams) => `status_flow_log?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'StatusFlowLog' as const, id: id! })
                        ),
                        { type: 'StatusFlowLog', id: 'LIST' },
                    ]:
                    [{type: 'StatusFlowLog', id: 'LIST'}],
            }),
            getTotalCountStatusFlowLog: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `status_flow_log/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }        
});



export const {
    useAddStatusFlowLogMutation, useUpdateStatusFlowLogMutation,
    useDeleteStatusFlowLogMutation, useGetDaftarStatusFlowLogByFiltersQuery,
    useGetTotalCountStatusFlowLogQuery,
} = StatusFlowLogApiSlice;