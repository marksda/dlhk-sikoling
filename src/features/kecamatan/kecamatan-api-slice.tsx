import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseRestAPIUrl, defaultKabupaten } from "../config/config";
import { IKecamatan } from "./kecamatan-slice";


export const KecamatanApiSlice = createApi({
    reducerPath: 'kecamatanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getAllKecamatan: builder.query<IKecamatan[], number|null>({
                query: () => `kecamatan`,
            }),
            getKecamatanByPage: builder.query<IKecamatan[], number|null>({
                query: (page = 1, pageSize = 10) => `kecamatan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getKecamatanByNama: builder.query<IKecamatan[], string|null>({
                query: (nama = 'jawa timur') => `kecamatan/nama?nama=${nama}`,
            }),
            getKecamatanByNamaAndPage: builder.query<IKecamatan[], string|null>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `kecamatan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getKecamatanByKabupaten: builder.query<IKecamatan[], string|null>({
                query: (idKabupaten = defaultKabupaten.id!) => `kecamatan/kabupaten?idKabupaten=${idKabupaten}`,
            }),
        }
    }
})

export const { useGetAllKecamatanQuery, useGetKecamatanByPageQuery, useGetKecamatanByNamaQuery, 
    useGetKecamatanByNamaAndPageQuery, useGetKecamatanByKabupatenQuery } = KecamatanApiSlice