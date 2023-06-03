import { createApi } from "@reduxjs/toolkit/query/react";
import { IKategoriDokumen } from "./kategori-dokumen-slice";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

type daftarKategoriDokumen = IKategoriDokumen[];

export const KategoriDokumenApiSlice = createApi({
    reducerPath: 'kategoriDokumenApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['KategoriDokumen'],
    endpoints(builder) {
        return {
            addKategoriDokumen: builder.mutation<IKategoriDokumen, Partial<IKategoriDokumen>>({
                query: (body) => ({
                    url: 'kategori_dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriDokumen', id: 'LIST'}],
            }),
            updateKategoriDokumen: builder.mutation<void, {id: string; kategoriDokumen: IKategoriDokumen}>({
                query: ({id, kategoriDokumen}) => ({
                    url: `kategori_dokumen/${id}`,
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'KategoriDokumen', id}],
            }),
            updateKategoriDokumenById: builder.mutation<void, {id: string; kategoriDokumen: IKategoriDokumen}>({
                query: ({id, kategoriDokumen}) => ({
                    url: `kategori_dokumen/id/${id}`,
                    method: 'PUT',
                    body: kategoriDokumen,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'KategoriDokumen', id}];
                }
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `kategori_dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'KategoriDokumen', id }],
            }),
            getKategoriDokumenByFilter: builder.query<daftarKategoriDokumen, IQueryParams>({
                query: (queryParams) => `kategori_dokumen?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriDokumen' as const, id: id! })
                        ),
                        { type: 'KategoriDokumen', id: 'LIST' },
                    ]:
                    [{type: 'KategoriDokumen', id: 'LIST'}],
            }),
            getTotalCountKategoriDokumen: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `kategori_dokumen/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    },
});

export const {
    useAddKategoriDokumenMutation, useUpdateKategoriDokumenMutation,
    useDeleteKategoriDokumenMutation, useUpdateKategoriDokumenByIdMutation,
    useGetKategoriDokumenByFilterQuery, useGetTotalCountKategoriDokumenQuery
} = KategoriDokumenApiSlice;