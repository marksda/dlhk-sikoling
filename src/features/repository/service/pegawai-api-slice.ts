import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPegawai } from "../../entity/pegawai";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";


type daftarPegawai = IPegawai[];

export const PegawaiApiSlice = createApi({
    reducerPath: 'pegawaiApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Pegawai'],
    endpoints(builder) {
        return {
            addPegawai: builder.mutation<IPegawai, Partial<IPegawai>>({
                query: (body) => ({
                    url: 'pegawai_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Pegawai', id: 'LIST'}],
            }),
            updatePegawai: builder.mutation<void, Partial<IPegawai>>({
                query: (body) => ({
                    url: 'pegawai_perusahaan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Pegawai', id: id as string}],
            }),
            updatePegawaiById: builder.mutation<void, {id: string; pegawai: IPegawai}>({
                query: ({id, pegawai}) => ({
                    url: `pegawai_perusahaan/id/${id}`,
                    method: 'PUT',
                    body: pegawai,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'Pegawai', id}];
                }
            }),
            deletePegawai: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `pegawai_perusahaan/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => {
                    return [{type: 'Pegawai', id}];
                }
            }),
            getAllDaftarPegawaiByFilter: builder.query<daftarPegawai, IQueryParamFilters>({
                query: (queryParams) => `pegawai_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Pegawai' as const, id: id! })
                        ),
                        { type: 'Pegawai', id: 'LIST' },
                    ]:
                    [{type: 'Pegawai', id: 'LIST'}],
            }),
            getTotalCountPegawai: builder.query<number, qFilters>({
                query: (queryFilters) => `pegawai_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddPegawaiMutation, useUpdatePegawaiMutation,
    useUpdatePegawaiByIdMutation, useDeletePegawaiMutation,
    useGetAllDaftarPegawaiByFilterQuery, useGetTotalCountPegawaiQuery
} = PegawaiApiSlice;