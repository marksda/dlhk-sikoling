import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IKategoriDokumen } from "./kategori-dokumen-slice";

type daftarKategoriDokumen = IKategoriDokumen[];

export const KategoriDokumenApiSlice = createApi({
    reducerPath: 'kategoriDokumenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['KategoriDokumen', 'KategoriDokumenPage', 'KategoriDokumenNama', 'KategoriDokumenNamaPage'],
    endpoints(builder) {
        return {
            addKategoriDokumen: builder.mutation<IKategoriDokumen, Partial<IKategoriDokumen>>({
                query: (body) => ({
                    url: 'kategori_dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriDokumen', id: 'LIST'}, {type: 'KategoriDokumenPage', id: 'LIST'}, {type: 'KategoriDokumenNama', id: 'LIST'}, {type: 'KategoriDokumenNamaPage', id: 'LIST'}],
            }),
            updateKategoriDokumen: builder.mutation<void, Pick<IKategoriDokumen, 'id'> & Partial<IKategoriDokumen>>({
                query: (body) => ({
                    url: 'kategori_dokumen',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'KategoriDokumen', id}, {type: 'KategoriDokumenPage', id}, {type: 'KategoriDokumenNama', id}, {type: 'KategoriDokumenNamaPage', id}],
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `kategori_dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'KategoriDokumen', id }, {type: 'KategoriDokumenPage', id}, {type: 'KategoriDokumenNama', id}, {type: 'KategoriDokumenNamaPage', id}],
            }),
            getAllKategoriDokumen: builder.query<daftarKategoriDokumen, void>({
                query: () => `kategori_dokumen`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriDokumen' as const, id })
                        ),
                        { type: 'KategoriDokumen', id: 'LIST' },
                    ]:
                    [{type: 'KategoriDokumen', id: 'LIST'}],
            }),
            getKategoriDokumenByPage: builder.query<daftarKategoriDokumen, {page: number, pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `kategori_dokumen/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriDokumenPage' as const, id })
                        ),
                        { type: 'KategoriDokumenPage', id: 'LIST' },
                    ]:
                    [{type: 'KategoriDokumenPage', id: 'LIST'}],
            }),
            getKategoriDokumenByNama: builder.query<daftarKategoriDokumen, string>({
                query: (nama) => `kategori_dokumen/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriDokumenNama' as const, id })
                        ),
                        { type: 'KategoriDokumenNama', id: 'LIST' },
                    ]:
                    [{type: 'KategoriDokumenNama', id: 'LIST'}],
            }),
            getKategoriDokumenByNamaAndPage: builder.query<daftarKategoriDokumen, {nama: string, page: number, pageSize: number}>({
                query: ({nama = '', page=1, pageSize=10}) => `kategori_dokumen/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriDokumenNamaPage' as const, id })
                        ),
                        { type: 'KategoriDokumenNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'KategoriDokumenNamaPage', id: 'LIST'}],
            }),
        }
    },
});

export const {
    useAddKategoriDokumenMutation, useUpdateKategoriDokumenMutation,
    useDeleteKategoriDokumenMutation, useGetAllKategoriDokumenQuery,
    useGetKategoriDokumenByPageQuery, useGetKategoriDokumenByNamaQuery,
    useGetKategoriDokumenByNamaAndPageQuery
} = KategoriDokumenApiSlice;