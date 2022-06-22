import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl, defaultKabupaten } from "../config/config";
import { IKecamatan } from "./kecamatan-slice";


export const KecamatanApiSlice = createApi({
    reducerPath: 'kecamatanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        // prepareHeaders(headers) {
        //     headers.set('x-api-key', Kecamatan_API_KEY);
        //     return headers;
        // },
    }),
    endpoints(builder) {
        return {
            getAllKecamatan: builder.query<IKecamatan[], number|void>({
                query: () => `/Kecamatan`,
            }),
            getKecamatanByPage: builder.query<IKecamatan[], number|void>({
                query: (page = 1, pageSize = 10) => `kecamatan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getKecamatanByNama: builder.query<IKecamatan[], string|void>({
                query: (nama = 'jawa timur') => `kecamatan/nama?nama=${nama}`,
            }),
            getKecamatanByNamaAndPage: builder.query<IKecamatan[], string|void>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `kecamatan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getKecamatanByKabupaten: builder.query<IKecamatan[], string|void>({
                query: (idKabupaten = defaultKabupaten.id) => `kecamatan/kabupaten?idKabupaten=${idKabupaten}`,
            }),
        }
    }
})

export const { useGetAllKecamatanQuery, useGetKecamatanByPageQuery, useGetKecamatanByNamaQuery, 
    useGetKecamatanByNamaAndPageQuery, useGetKecamatanByKabupatenQuery } = KecamatanApiSlice