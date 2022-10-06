import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseRestAPIUrl, defaultKabupaten } from "../config/config";
import { IPerusahaan } from "./perusahaan-slice";

export const PerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getAllPerusahaan: builder.query<IPerusahaan[], number|void>({
                query: () => `kecamatan`,
            }),
            getPerusahaanByPage: builder.query<IPerusahaan[], number|void>({
                query: (page = 1, pageSize = 10) => `kecamatan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanByNama: builder.query<IPerusahaan[], string|void>({
                query: (nama) => `kecamatan/nama?nama=${nama}`,
            }),
            getPerusahaanByNamaAndPage: builder.query<IPerusahaan[], string|void>({
                query: (nama, page=1, pageSize=10) => `kecamatan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanById: builder.query<IPerusahaan[], string|void>({
                query: (idPerusahaan) => `kecamatan/kabupaten?idKabupaten=${idPerusahaan}`,
            }),
        }
    }
})

export const { useGetAllPerusahaanQuery, useGetPerusahaanByPageQuery, useGetPerusahaanByNamaAndPageQuery, 
    useLazyGetPerusahaanByNamaAndPageQuery, useGetPerusahaanByIdQuery } = PerusahaanApiSlice