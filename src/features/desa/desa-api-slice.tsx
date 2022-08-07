import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseRestAPIUrl, defaultKecamatan } from "../config/config";
import { IDesa } from "./desa-slice";


export const DesaApiSlice = createApi({
    reducerPath: 'desaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getAllDesa: builder.query<IDesa[], number|void>({
                query: () => `desa`,
            }),
            getDesaByPage: builder.query<IDesa[], number|void>({
                query: (page = 1, pageSize = 10) => `desa/page?page=${page}&pageSize=${pageSize}`,
            }),
            getDesaByNama: builder.query<IDesa[], string|void>({
                query: (nama = 'jawa timur') => `desa/nama?nama=${nama}`,
            }),
            getDesaByNamaAndPage: builder.query<IDesa[], string|void>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `desa/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getDesaByKecamatan: builder.query<IDesa[], string|void>({
                query: (idKecamatan = defaultKecamatan.id!) => `desa/kecamatan?idKecamatan=${idKecamatan}`,
            }),
        }
    }
})

export const { useGetAllDesaQuery, useGetDesaByPageQuery, useGetDesaByNamaQuery, 
    useGetDesaByNamaAndPageQuery, useGetDesaByKecamatanQuery } = DesaApiSlice