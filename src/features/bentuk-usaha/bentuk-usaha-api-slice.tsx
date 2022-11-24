import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl, defaultHalaman as halaman } from "../config/config";
import { IBentukUsaha } from "./bentuk-usaha-slice";


export const BentukUsahaApiSlice = createApi({
    reducerPath: 'bentukUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints: (builder) => {
        return {
            getAllBentukUsaha: builder.query<IBentukUsaha[], void>({
                query: () => `bentuk_usaha`,
            }),
            getBentukUsahaByPage: builder.query<IBentukUsaha[], number|void>({
                query: (page = 1, pageSize = 10) => `bentuk_usaha/page?page=${page}&pageSize=${pageSize}`,
            }),
            getBentukUsahaByNama: builder.query<IBentukUsaha[], string|void>({
                query: (nama) => `bentuk_usaha/nama?nama=${nama}`,
            }),
            getBentukUsahaByNamaAndPage: builder.query<IBentukUsaha[], string|void>({
                query: (nama, page=halaman.page, pageSize=halaman.pageSize) => `bentuk_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getBentukUsahaByPelakuUsaha: builder.query<IBentukUsaha[], string|void>({
                query: (idKelompok) => `bentuk_usaha/kelompok?idKelompok=${idKelompok}`,
            }),
        };
    },
});

export const { 
    useGetAllBentukUsahaQuery, useGetBentukUsahaByPageQuery, 
    useGetBentukUsahaByNamaQuery, useGetBentukUsahaByNamaAndPageQuery, 
    useGetBentukUsahaByPelakuUsahaQuery
} = BentukUsahaApiSlice;

