import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl, defaultHalaman as halaman } from "../config/config";
import { IJenisPelakuUsaha } from "./jenis-pelaku-usaha-slice";

export const jenisPelakuUsahaApiSlice = createApi({
    reducerPath: 'jenisPelakuUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
    }),
    endpoints: (builder) => {
        return {
            getAllJenisPelakuUsaha: builder.query<IJenisPelakuUsaha[], void>({
                query: () => `jenis_pelaku_usaha`,
            }),
            getJenisPelakuUsahaByPage: builder.query<IJenisPelakuUsaha[], number|void>({
                query: (page = 1, pageSize = 10) => `jenis_pelaku_usaha/page?page=${page}&pageSize=${pageSize}`,
            }),
            getJenisPelakuUsahaByNama: builder.query<IJenisPelakuUsaha[], string|void>({
                query: (nama) => `jenis_pelaku_usaha/nama?nama=${nama}`,
            }),
            getJenisPelakuUsahaByNamaAndPage: builder.query<IJenisPelakuUsaha[], string|void>({
                query: (nama, page=halaman.page, pageSize=halaman.pageSize) => `jenis_pelaku_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
        }
    }
});

export const { useGetAllJenisPelakuUsahaQuery, useGetJenisPelakuUsahaByPageQuery, useGetJenisPelakuUsahaByNamaQuery, useGetJenisPelakuUsahaByNamaAndPageQuery } = jenisPelakuUsahaApiSlice