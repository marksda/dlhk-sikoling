import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IPerusahaan } from "./perusahaan-slice";

export const PerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getAllPerusahaan: builder.query<IPerusahaan[], number|void>({
                query: () => `pemrakarsa`,
            }),
            getPerusahaanByPage: builder.query<IPerusahaan[], number|void>({
                query: (page = 1, pageSize = 10) => `pemrakarsa/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanByNama: builder.query<IPerusahaan[], string|void>({
                query: (nama) => `pemrakarsa/nama?nama=${nama}`,
            }),
            getPerusahaanByNamaAndPage: builder.query<IPerusahaan[], string|void>({
                query: (nama, page=1, pageSize=10) => `pemrakarsa/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanById: builder.query<IPerusahaan[], string|void>({
                query: (idPerusahaan) => `pemrakarsa/kabupaten?idKabupaten=${idPerusahaan}`,
            }),
        }
    }
});

export const { 
    useGetAllPerusahaanQuery, useGetPerusahaanByPageQuery, useGetPerusahaanByNamaAndPageQuery, 
    useLazyGetPerusahaanByNamaAndPageQuery, useGetPerusahaanByIdQuery 
} = PerusahaanApiSlice;