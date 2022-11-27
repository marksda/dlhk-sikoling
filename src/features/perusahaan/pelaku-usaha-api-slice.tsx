import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";
import { IKategoriPelakuUsaha } from "./kategori-pelaku-usaha-slice";
import { ISkalaUsaha } from "./skala-usaha-api-slice";

export interface IPelakuUsaha {
    id: string|undefined;
    nama: string|undefined;
    singkatan: string|undefined;
    kategoriPelakuUsaha: IKategoriPelakuUsaha|undefined;
};

export const PelakuUsahaApiSlice = createApi({
    reducerPath: 'pelakuUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            addKategoriPelakuUsaha: builder.mutation({
                query: (body) => ({
                    url: 'pelaku_usaha/kategori',
                    method: 'POST',
                    body,
                })
            }),
            addPelakuUsaha: builder.mutation({
                query: (body) => ({
                    url: 'pelaku_usaha',
                    method: 'POST',
                    body,
                })
            }),
            updateKategoriPelakuUsaha: builder.mutation({
                query: (body) => ({
                    url: 'pelaku_usaha/kategori',
                    method: 'PUT',
                    body,
                })
            }),
            updatePelakuUsaha: builder.mutation({
                query: (body) => ({
                    url: 'pelaku_usaha',
                    method: 'PUT',
                    body,
                })
            }),
            getAllKategoriPelakuUsaha: builder.query<IKategoriPelakuUsaha[], void>({
                query: () => `pelaku_usaha/kategori`,
            }),
            getAllKategoriPelakuUsahaBySkalaUsaha: builder.query<IKategoriPelakuUsaha[], ISkalaUsaha>({
                query: (skalaUsaha) => `pelaku_usaha/kategori/by_skala_usaha?idSkalaUsaha=${skalaUsaha.id}`,
            }),
            getAllPelakuUsaha: builder.query<IPelakuUsaha[], void>({
                query: () => `pelaku_usaha`,
            }),
            getKategoriPelakuUsahaByPage: builder.query<IKategoriPelakuUsaha[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `pelaku_usaha/kategori/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPelakuUsahaByPage: builder.query<IPelakuUsaha[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `pelaku_usaha/page?page=${page}&pageSize=${pageSize}`,
            }),
            getKategoriPelakuUsahaByNama: builder.query<IKategoriPelakuUsaha[], string|void>({
                query: (nama) => `pelaku_usaha/kategori/nama?nama=${nama}`,
            }),
            getPelakuUsahaByNama: builder.query<IPelakuUsaha[], string|void>({
                query: (nama) => `pelaku_usaha/nama?nama=${nama}`,
            }),
            getKategoriPelakuUsahaByNamaAndPage: builder.query<IKategoriPelakuUsaha[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `pelaku_usaha/kategori/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPelakuUsahaByNamaAndPage: builder.query<IPelakuUsaha[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `pelaku_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPelakuUsahaByKategoriPelakuUsaha: builder.query<IPelakuUsaha[], IKategoriPelakuUsaha>({
                query: (kategoriPelakuUsaha) => `pelaku_usaha/by_kategori?idKategori=${kategoriPelakuUsaha.id}`,
            })
        }
    }
});

export const { 
    useAddKategoriPelakuUsahaMutation, useAddPelakuUsahaMutation,
    useUpdateKategoriPelakuUsahaMutation,useUpdatePelakuUsahaMutation,
    useGetAllKategoriPelakuUsahaQuery, useGetAllPelakuUsahaQuery,
    useGetKategoriPelakuUsahaByPageQuery, useGetPelakuUsahaByPageQuery,
    useGetKategoriPelakuUsahaByNamaQuery, useGetPelakuUsahaByNamaQuery,
    useGetKategoriPelakuUsahaByNamaAndPageQuery, useGetPelakuUsahaByNamaAndPageQuery,
    useGetPelakuUsahaByKategoriPelakuUsahaQuery, useGetAllKategoriPelakuUsahaBySkalaUsahaQuery
} = PelakuUsahaApiSlice;