import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

export interface IStatusWali {
    id: string|null;
    nama: string|null;
}

type daftarStatusWaliPermohonan = IStatusWali[];

export const StatusWaliPermohonanApiSlice = createApi({
    reducerPath: 'statusWaliPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['StatusWaliPermohonan'],
    endpoints(builder) {
        return {
            addStatusWaliPermohonan: builder.mutation<IStatusWali, Partial<IStatusWali>>({
                query: (body) => ({
                    url: 'status_pengurus_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'StatusWaliPermohonan', id: 'LIST'}],
            }),
            updateStatusWaliPermohonan: builder.mutation<void, Partial<IStatusWali>>({
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
            getDaftarStatusWaliPermohonanByFilters: builder.query<daftarStatusWaliPermohonan, IQueryParams>({
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
            getTotalCountStatusWaliPermohonan: builder.query<number, Pick<IQueryParams, "filters">>({
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
