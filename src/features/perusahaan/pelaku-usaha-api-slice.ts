import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";
import { IKategoriPelakuUsaha } from "./kategori-pelaku-usaha-slice";
import { IPelakuUsaha } from "./pelaku-usaha-slice";

type daftarPelakuUsaha = IPelakuUsaha[];

export const PelakuUsahaApiSlice = createApi({
    reducerPath: 'pelakuUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['PelakuUsaha', 'PelakuUsahaPage', 'PelakuUsahaNama', 'PelakuUsahaNamaPage', 'PelakuUsahaKategoriPelakuUsaha', 'PelakuUsahaKategoriPelakuUsahaPage'],
    endpoints(builder) {
        return {
            addPelakuUsaha: builder.mutation<IPelakuUsaha, Partial<IPelakuUsaha>>({
                query: (body) => ({
                    url: 'pelaku_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'PelakuUsaha', id: 'LIST'}, {type: 'PelakuUsahaPage', id: 'LIST'}, {type: 'PelakuUsahaNama', id: 'LIST'}, {type: 'PelakuUsahaNamaPage', id: 'LIST'}, {type: 'PelakuUsahaKategoriPelakuUsaha', id: 'LIST'}, {type: 'PelakuUsahaKategoriPelakuUsahaPage', id: 'LIST'}],
            }),
            updatePelakuUsaha: builder.mutation<void, {id: string, pelakuUsaha: IPelakuUsaha}>({
                query: ({id, pelakuUsaha}) => ({
                    url: `pelaku_usaha/${id}`,
                    method: 'PUT',
                    body: pelakuUsaha,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'PelakuUsaha', id: 'LIST'}, {type: 'PelakuUsahaPage', id: 'LIST'}, {type: 'PelakuUsahaNama', id: 'LIST'}, {type: 'PelakuUsahaNamaPage', id: 'LIST'}, {type: 'PelakuUsahaKategoriPelakuUsaha', id: 'LIST'}, {type: 'PelakuUsahaKategoriPelakuUsahaPage', id: 'LIST'}],
            }),
            deletePelakuUsaha: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `pelaku_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'PelakuUsaha', id }, { type: 'PelakuUsahaPage', id }, { type: 'PelakuUsahaNama', id }, { type: 'PelakuUsahaNamaPage', id }, {type: 'PelakuUsahaKategoriPelakuUsaha', id}, {type: 'PelakuUsahaKategoriPelakuUsahaPage', id}]
            }),
            getAllPelakuUsaha: builder.query<daftarPelakuUsaha, void>({
                query: () => `pelaku_usaha`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsaha' as const, id: id! })
                        ),
                        { type: 'PelakuUsaha', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsaha', id: 'LIST'}],
            }),
            getPelakuUsahaByPage: builder.query<daftarPelakuUsaha, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `pelaku_usaha/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsahaPage' as const, id: id! })
                        ),
                        { type: 'PelakuUsahaPage', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsahaPage', id: 'LIST'}],
            }),
            getPelakuUsahaByNama: builder.query<daftarPelakuUsaha, string>({
                query: (nama) => `pelaku_usaha/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsahaNama' as const, id: id! })
                        ),
                        { type: 'PelakuUsahaNama', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsahaNama', id: 'LIST'}],
            }),
            getPelakuUsahaByNamaAndPage: builder.query<daftarPelakuUsaha, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page, pageSize}) => `pelaku_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsahaNamaPage' as const, id: id! })
                        ),
                        { type: 'PelakuUsahaNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsahaNamaPage', id: 'LIST'}],
            }),
            getPelakuUsahaByKategoriPelakuUsaha: builder.query<daftarPelakuUsaha, string>({
                query: (idKategori) => `pelaku_usaha/kategori/${idKategori}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsahaKategoriPelakuUsaha' as const, id: id! })
                        ),
                        { type: 'PelakuUsahaKategoriPelakuUsaha', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsahaKategoriPelakuUsaha', id: 'LIST'}],
            })
        }
    }
});

export const { 
    useAddPelakuUsahaMutation, useUpdatePelakuUsahaMutation,
    useDeletePelakuUsahaMutation, useGetAllPelakuUsahaQuery,
    useGetPelakuUsahaByPageQuery, useGetPelakuUsahaByNamaQuery,
    useGetPelakuUsahaByNamaAndPageQuery, useGetPelakuUsahaByKategoriPelakuUsahaQuery
} = PelakuUsahaApiSlice;