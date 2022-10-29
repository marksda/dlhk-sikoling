import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";
import { IPerusahaan } from "./perusahaan-slice";

export const PerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            addPerusahaan: builder.mutation({
                query: (body) => ({
                    url: 'perusahaan',
                    method: 'POST',
                    body,
                })
            }),
            updatePerusahaan: builder.mutation({
                query: (body) => ({
                    url: 'perusahaan',
                    method: 'PUT',
                    body,
                })
            }),
            getAllPerusahaan: builder.query<IPerusahaan[], void>({
                query: () => `perusahaan`,
            }),
            getPerusahaanByPage: builder.query<IPerusahaan[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `perusahaan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanByNama: builder.query<IPerusahaan[], string|void>({
                query: (nama) => `perusahaan/nama?nama=${nama}`,
            }),
            getPerusahaanByNamaAndPage: builder.query<IPerusahaan[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `perusahaan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanById: builder.query<IPerusahaan[], string|void>({
                query: (idPerusahaan) => `perusahaan/kabupaten?idKabupaten=${idPerusahaan}`,
            }),
            isEksisPeusahaan: builder.query<boolean, string|void>({
                query: (idPerusahaan) => `perusahaan/is_eksis?id=${idPerusahaan}`,
            }),
        }
    }
});

export const { 
    useGetAllPerusahaanQuery, useGetPerusahaanByPageQuery, useGetPerusahaanByNamaAndPageQuery, 
    useLazyGetPerusahaanByNamaAndPageQuery, useGetPerusahaanByIdQuery, useIsEksisPeusahaanQuery
} = PerusahaanApiSlice;