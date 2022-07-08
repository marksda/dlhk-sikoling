import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPropinsi } from "./propinsi-slice";
import { baseUrl, defaultHalaman as halaman } from "../../features/config/config";

// const PROPINSI_API_KEY: string = '234a-fe23ab-8cc76d-123aed';

export const propinsiApiSlice = createApi({
    reducerPath: 'propinsiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        // prepareHeaders(headers) {
        //     headers.set('x-api-key', PROPINSI_API_KEY);
        //     return headers;
        // },
    }),
    endpoints(builder) {
        return {
            getAllPropinsi: builder.query<IPropinsi[], void>({
                query: () => `propinsi`,
            }),
            getPropinsiByPage: builder.query<IPropinsi[], number|void>({
                query: (page = 1, pageSize = 10) => `propinsi/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPropinsiByNama: builder.query<IPropinsi[], string|void>({
                query: (nama = 'jawa timur') => `propinsi/nama?nama=${nama}`,
            }),
            getPropinsiByNamaAndPage: builder.query<IPropinsi[], string|void>({
                query: (nama = 'jawa timur', page=halaman.page, pageSize=halaman.pageSize) => `propinsi/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
        }
    }
})

export const { useGetAllPropinsiQuery, useGetPropinsiByPageQuery, useGetPropinsiByNamaQuery, useGetPropinsiByNamaAndPageQuery } = propinsiApiSlice;