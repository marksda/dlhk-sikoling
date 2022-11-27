import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IKategoriDokumen } from "../dokumen/kategori-dokumen-slice";
import { IKategoriPelakuUsaha } from "./kategori-pelaku-usaha-slice";

type daftarKategoriPelakuUsaha = IKategoriPelakuUsaha[];

export const KategoriPelakuUsahaApiSlice = createApi({
    reducerPath: 'kategoriPelakuUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['KategoriPelakuUsaha', 'KategoriPelakuUsahaPage', 'KategoriPelakuUsahaNama', 'KategoriPelakuUsahaNamaPage', 'KategoriPelakuUsahaSkalaUsaha'],
    endpoints(builder) {
        return {
            addKategoriPelakuUsaha: builder.mutation<IKategoriDokumen, Partial<IKategoriPelakuUsaha>>({
                query: (body) => ({
                    url: 'kategori_pelaku_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriPelakuUsaha', id: 'LIST'}, {type: 'KategoriPelakuUsahaPage', id: 'LIST'}, {type: 'KategoriPelakuUsahaNama', id: 'LIST'}, {type: 'KategoriPelakuUsahaNamaPage', id: 'LIST'}, {type: 'KategoriPelakuUsahaSkalaUsaha', id: 'LIST'}],
            }),
            updateKategoriPelakuUsaha: builder.mutation<void, {id: string; kategoriPelakuUsaha: IKategoriPelakuUsaha}>({
                query: ({id, kategoriPelakuUsaha}) => ({
                    url: `kategori_pelaku_usaha/${id}`,
                    method: 'PUT',
                    body: kategoriPelakuUsaha,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'KategoriPelakuUsaha', id}, {type: 'KategoriPelakuUsahaPage', id}, {type: 'KategoriPelakuUsahaNama', id}, {type: 'KategoriPelakuUsahaNamaPage', id}, {type: 'KategoriPelakuUsahaSkalaUsaha', id}],
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `kategori_pelaku_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'KategoriPelakuUsaha', id }, { type: 'KategoriPelakuUsahaPage', id }, { type: 'KategoriPelakuUsahaNama', id }, { type: 'KategoriPelakuUsahaNamaPage', id }, { type: 'KategoriPelakuUsahaSkalaUsaha', id }],
            }),
            getAllKategoriPelakuUsaha: builder.query<daftarKategoriPelakuUsaha, void>({
                query: () => `kategori_pelaku_usaha`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsaha' as const, id })
                        ),
                        { type: 'KategoriPelakuUsaha', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsaha', id: 'LIST'}],
            }),
            getKategoriPelakuUsahaByPage: builder.query<daftarKategoriPelakuUsaha, {page: number; pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `kategori_pelaku_usaha/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsahaPage' as const, id })
                        ),
                        { type: 'KategoriPelakuUsahaPage', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsahaPage', id: 'LIST'}],
            }),
            getKategoriPelakuUsahaByNama: builder.query<daftarKategoriPelakuUsaha, string>({
                query: (nama) => `kategori_pelaku_usaha/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsahaNama' as const, id })
                        ),
                        { type: 'KategoriPelakuUsahaNama', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsahaNama', id: 'LIST'}],
            }),
            getkategoriPelakuUsahaByNamaAndPage: builder.query<daftarKategoriPelakuUsaha, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page, pageSize}) => `kategori_pelaku_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsahaNamaPage' as const, id })
                        ),
                        { type: 'KategoriPelakuUsahaNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsahaNamaPage', id: 'LIST'}],
            }),
            getKategoriPelakuUsahaBySkalaUsaha: builder.query<daftarKategoriPelakuUsaha, string>({
                query: (idSkalaUsaha) => `kategori_pelaku_usaha/skala_usaha/${idSkalaUsaha}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPelakuUsahaSkalaUsaha' as const, id })
                        ),
                        { type: 'KategoriPelakuUsahaSkalaUsaha', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPelakuUsahaSkalaUsaha', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddKategoriPelakuUsahaMutation, useUpdateKategoriPelakuUsahaMutation,
    useDeleteKategoriDokumenMutation, useGetAllKategoriPelakuUsahaQuery,
    useGetKategoriPelakuUsahaByPageQuery, useGetKategoriPelakuUsahaByNamaQuery,
    useGetkategoriPelakuUsahaByNamaAndPageQuery, useGetKategoriPelakuUsahaBySkalaUsahaQuery
} = KategoriPelakuUsahaApiSlice;