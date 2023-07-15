import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IStatusWaliPermohonan } from "../entity/status-wali-permohonan";
import { IQueryParamFilters, qFilters } from "../entity/query-param-filters";


type daftarStatusWaliPermohonan = IStatusWaliPermohonan[];

export const StatusWaliPermohonanApiSlice = createApi({
    reducerPath: 'statusWaliPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['StatusWaliPermohonan'],
    endpoints(builder) {
        return {
            addStatusWaliPermohonan: builder.mutation<IStatusWaliPermohonan, Partial<IStatusWaliPermohonan>>({
                query: (body) => ({
                    url: 'status_pengurus_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'StatusWaliPermohonan', id: 'LIST'}],
            }),
            updateStatusWaliPermohonan: builder.mutation<void, Partial<IStatusWaliPermohonan>>({
                query: (perusahaan) => ({
                    url: 'status_pengurus_permohonan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'StatusWaliPermohonan', id: id!}];
                },
            }),
            deleteStatusWaliPermohonan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idStatusWaliPermohonan) {
                  return {
                    url: `status_pengurus_permohonan/${idStatusWaliPermohonan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idStatusWaliPermohonan) => {
                    return [{type: 'StatusWaliPermohonan', id: idStatusWaliPermohonan}]
                },
            }),
            getDaftarStatusWaliPermohonanByFilters: builder.query<daftarStatusWaliPermohonan, IQueryParamFilters>({
                query: (queryParams) => `status_pengurus_permohonan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'StatusWaliPermohonan' as const, id: id! })
                        ),
                        { type: 'StatusWaliPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'StatusWaliPermohonan', id: 'LIST'}],
            }),
            getTotalCountStatusWaliPermohonan: builder.query<number, qFilters>({
                query: (queryFilters) => `status_pengurus_permohonan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddStatusWaliPermohonanMutation, useUpdateStatusWaliPermohonanMutation,
    useDeleteStatusWaliPermohonanMutation, useGetDaftarStatusWaliPermohonanByFiltersQuery,
    useGetTotalCountStatusWaliPermohonanQuery
} = StatusWaliPermohonanApiSlice;
