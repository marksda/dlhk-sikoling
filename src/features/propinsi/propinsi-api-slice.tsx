import { createEntityAdapter } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IPropinsi } from "./propinsi-slice";

const PROPINSI_API_KEY: string = '234a-fe23ab-8cc76d-123aed';

export const propinsiApiSlice = createApi({
    reducerPath: 'propinsiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/Sikoling-web/api',
        // prepareHeaders(headers) {
        //     headers.set('x-api-key', PROPINSI_API_KEY);
        //     return headers;
        // },
    }),
    endpoints(builder) {
        return {
            getAll: builder.query<IPropinsi[], number|void>({
                query: () => `/propinsi`,
            }),
            getAllByPage: builder.query<IPropinsi[], number|void>({
                query: (page = 1, pageSize = 10) => `propinsi/page?page=${page}&pageSize=${pageSize}`,
            }),
            getByNama: builder.query<IPropinsi[], string|void>({
                query: (nama = 'jawa timur') => `propinsi/nama?nama=${nama}`,
            }),
            getByNamaAndPage: builder.query<IPropinsi[], string|void>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `propinsi/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
        }
    }
})

export const { useGetAllQuery, useGetAllByPageQuery, useGetByNamaQuery, useGetByNamaAndPageQuery } = propinsiApiSlice