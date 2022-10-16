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
                query: () => `pemrakarsa`,
            }),
            getPerusahaanByPage: builder.query<IPerusahaan[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `pemrakarsa/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanByNama: builder.query<IPerusahaan[], string|void>({
                query: (nama) => `pemrakarsa/nama?nama=${nama}`,
            }),
            getPerusahaanByNamaAndPage: builder.query<IPerusahaan[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `pemrakarsa/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
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