import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";

export interface IKategoriPelakuUsaha {
    id: string|null;
    nama: string|null
};

export interface IPelakuUsaha {
    id: string|null;
    nama: string|null;
    singkatan: string|null;
    kategoriPelakuUsaha: IKategoriPelakuUsaha|null;
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
    useGetKategoriPelakuUsahaByNamaAndPageQuery, useGetPelakuUsahaByNamaAndPageQuery
} = PelakuUsahaApiSlice;