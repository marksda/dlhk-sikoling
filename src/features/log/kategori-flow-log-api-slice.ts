import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

export interface IKategoriFlowLog {
    id: string|null;
    nama: string|null;
};

type DaftarKategoriFlowLog = IKategoriFlowLog[];

export const KategoriFlowLogApiSlice = createApi({
    reducerPath: 'kategoriFlowLogApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    // keepUnusedDataFor: 30,
    tagTypes: ['KategoriFlowLog'],
    endpoints(builder) {
        return {
            addKategoriFlowLog: builder.mutation<IKategoriFlowLog, Partial<IKategoriFlowLog>>({
                query: (body) => ({
                    url: 'kategori_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriFlowLog', id: 'LIST'}],
            }),
            updateKategoriFlowLog: builder.mutation<void, Partial<IKategoriFlowLog>>({
                query: (perusahaan) => ({
                    url: 'kategori_log',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'KategoriFlowLog', id: id!}];
                },
            }),
            deleteKategoriFlowLog: builder.mutation<{ success: boolean; id: string }, string>({
                query(idKategoriFlowLog) {
                  return {
                    url: `kategori_log/${idKategoriFlowLog}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idKategoriFlowLog) => {
                    return [{type: 'KategoriFlowLog', id: idKategoriFlowLog}]
                },
            }),
            getDaftarKategoriFlowLogByFilters: builder.query<DaftarKategoriFlowLog, IQueryParams>({
                query: (queryParams) => `kategori_log/qparams?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriFlowLog' as const, id: id! })
                        ),
                        { type: 'KategoriFlowLog', id: 'LIST' },
                    ]:
                    [{type: 'KategoriFlowLog', id: 'LIST'}],
            }),
            getAll: builder.query<DaftarKategoriFlowLog, void>({
                query: () => 'kategori_log',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriFlowLog' as const, id: id! })
                        ),
                        { type: 'KategoriFlowLog', id: 'LIST' },
                    ] : [{type: 'KategoriFlowLog', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddKategoriFlowLogMutation, useUpdateKategoriFlowLogMutation,
    useDeleteKategoriFlowLogMutation, useGetDaftarKategoriFlowLogByFiltersQuery,
    useGetAllQuery
} = KategoriFlowLogApiSlice;