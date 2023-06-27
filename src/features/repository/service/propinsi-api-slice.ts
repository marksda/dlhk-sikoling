import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl, defaultHalaman as halaman } from "../../config/config";
import { IPropinsi } from "../../entity/propinsi";

// const PROPINSI_API_KEY: string = '234a-fe23ab-8cc76d-123aed';

type daftarPropinsi = IPropinsi[];

export const PropinsiApiSlice = createApi({
    reducerPath: 'propinsiApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
        // prepareHeaders(headers) {
        //     headers.set('x-api-key', PROPINSI_API_KEY);
        //     return headers;
        // },
    }),
    endpoints(builder) {
        return {
            getAllPropinsi: builder.query<daftarPropinsi, void>({
                query: () => `propinsi`,
            }),
            getPropinsiByPage: builder.query<daftarPropinsi, number|void>({
                query: (page = 1, pageSize = 10) => `propinsi/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPropinsiByNama: builder.query<daftarPropinsi, string|void>({
                query: (nama = 'jawa timur') => `propinsi/nama?nama=${nama}`,
            }),
            getPropinsiByNamaAndPage: builder.query<daftarPropinsi, string|void>({
                query: (nama = 'jawa timur', page=halaman.page, pageSize=halaman.pageSize) => `propinsi/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
        }
    }
});

export const { useGetAllPropinsiQuery, useGetPropinsiByPageQuery, useGetPropinsiByNamaQuery, useGetPropinsiByNamaAndPageQuery } = PropinsiApiSlice;