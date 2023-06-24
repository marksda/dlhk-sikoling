import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IJabatan } from "../../entity/jabatan";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarJabatan = IJabatan[];

export const JabatanApiSlice = createApi({
    reducerPath: 'jabatanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Jabatan'],
    endpoints(builder) {
        return {
            addJabatan: builder.mutation<IJabatan, Partial<IJabatan>>({
                query: (body) => ({
                    url: 'jabatan_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Jabatan', id: 'LIST'}],
            }),
            updateJabatan: builder.mutation<void, Partial<IJabatan>>({
                query: (posisiTahapPemberkasan) => ({
                    url: 'jabatan_perusahaan',
                    method: 'PUT',
                    body: posisiTahapPemberkasan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'Jabatan', id: id!}];
                },
            }),
            deleteJabatan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idJabatan) {
                  return {
                    url: `jabatan_perusahaan/${idJabatan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idJabatan) => {
                    return [{type: 'Jabatan', id: idJabatan}]
                },
            }),
            getDaftarJabatanByFilters: builder.query<daftarJabatan, IQueryParamFilters>({
                query: (queryParams) => `jabatan_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Jabatan' as const, id: id! })
                        ),
                        { type: 'Jabatan', id: 'LIST' },
                    ]:
                    [{type: 'Jabatan', id: 'LIST'}],
            }),
            getTotalCountJabatan: builder.query<number, qFilters>({
                query: (queryFilters) => `jabatan_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    }
});

export const {
    useAddJabatanMutation, useUpdateJabatanMutation,
    useDeleteJabatanMutation, useGetDaftarJabatanByFiltersQuery,
    useGetTotalCountJabatanQuery
} = JabatanApiSlice;