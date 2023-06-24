import { createApi } from "@reduxjs/toolkit/query/react";
import { IKategoriDokumen } from "../../dokumen/kategori-dokumen-slice";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IKategoriPelakuUsaha } from "../../entity/kategori-pelaku-usaha";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

export type daftarKategoriPelakuUsaha = IKategoriPelakuUsaha[];

export const KategoriPelakuUsahaApiSlice = createApi({
    reducerPath: 'kategoriPelakuUsahaApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['KategoriPelakuUsaha'],
    endpoints(builder) {
        return {
            addKategoriPelakuUsaha: builder.mutation<IKategoriDokumen, Partial<IKategoriPelakuUsaha>>({
                query: (body) => ({
                    url: 'kategori_pelaku_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriPelakuUsaha', id: 'LIST'}],
            }),
            updateKategoriPelakuUsaha: builder.mutation<void, {id: string; kategoriPelakuUsaha: IKategoriPelakuUsaha}>({
                query: ({id, kategoriPelakuUsaha}) => ({
                    url: `kategori_pelaku_usaha/${id}`,
                    method: 'PUT',
                    body: kategoriPelakuUsaha,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'KategoriPelakuUsaha', id}];
                }
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `kategori_pelaku_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => {
                    return [{ type: 'KategoriPelakuUsaha', id }];
                }
            }),
            getAllKategoriPelakuUsaha: builder.query<daftarKategoriPelakuUsaha, IQueryParamFilters>({
                query: (queryParams) => `kategori_pelaku_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsaha' as const, id: id! })
                        ),
                        { type: 'KategoriPelakuUsaha', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsaha', id: 'LIST'}],
            }),
            getTotalCountKategoriPelakuUsaha: builder.query<number, qFilters>({
                query: (queryFilters) => `kategori_pelaku_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddKategoriPelakuUsahaMutation, useUpdateKategoriPelakuUsahaMutation,
    useDeleteKategoriDokumenMutation, useGetAllKategoriPelakuUsahaQuery,
    useGetTotalCountKategoriPelakuUsahaQuery
} = KategoriPelakuUsahaApiSlice;