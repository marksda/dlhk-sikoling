import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParamFilters } from "../entity/query-param-filters";

export interface IKategoriPermohonan {
    id: string|null;
    nama: string|null;
}

type daftarKategoriPermohonan = IKategoriPermohonan[];

export const KategoriPermohonanApiSlice = createApi({
    reducerPath: 'kategoriPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['KategoriPermohonan'],
    endpoints(builder) {
        return {
            addKategoriPermohonan: builder.mutation<IKategoriPermohonan, Partial<IKategoriPermohonan>>({
                query: (body) => ({
                    url: 'kategori_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriPermohonan', id: 'LIST'}],
            }),
            updateKategoriPermohonan: builder.mutation<void, Partial<IKategoriPermohonan>>({
                query: (perusahaan) => ({
                    url: 'kategori_permohonan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'KategoriPermohonan', id: id!}];
                },
            }),
            deleteKategoriPermohonan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idKategoriPermohonan) {
                  return {
                    url: `kategori_permohonan/${idKategoriPermohonan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idKategoriPermohonan) => {
                    return [{type: 'KategoriPermohonan', id: idKategoriPermohonan}]
                },
            }),
            getDaftarKategoriPermohonanByFilters: builder.query<daftarKategoriPermohonan, IQueryParamFilters>({
                query: (queryParams) => `kategori_permohonan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPermohonan' as const, id: id! })
                        ),
                        { type: 'KategoriPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPermohonan', id: 'LIST'}],
            }),
            getTotalCountKategoriPermohonan: builder.query<number, Pick<IQueryParamFilters, "filters">>({
                query: (queryFilters) => `kategori_permohonan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    }
});

export const {
    useAddKategoriPermohonanMutation, useUpdateKategoriPermohonanMutation,
    useDeleteKategoriPermohonanMutation, useGetDaftarKategoriPermohonanByFiltersQuery,
    useGetTotalCountKategoriPermohonanQuery
} = KategoriPermohonanApiSlice;