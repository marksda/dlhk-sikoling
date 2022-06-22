import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseUrl, defaultPropinsi } from "../config/config";
import { IKabupaten } from "./kabupaten-slice";

const Kabupaten_API_KEY: string = '234a-fe23ab-8cc76d-123aed';

export const KabupatenApiSlice = createApi({
    reducerPath: 'kabupatenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        // prepareHeaders(headers) {
        //     headers.set('x-api-key', Kabupaten_API_KEY);
        //     return headers;
        // },
    }),
    endpoints(builder) {
        return {
            getAllKabupaten: builder.query<IKabupaten[], number|void>({
                query: () => `/Kabupaten`,
            }),
            getKabupatenByPage: builder.query<IKabupaten[], number|void>({
                query: (page = 1, pageSize = 10) => `kabupaten/page?page=${page}&pageSize=${pageSize}`,
            }),
            getKabupatenByNama: builder.query<IKabupaten[], string|void>({
                query: (nama = 'jawa timur') => `kabupaten/nama?nama=${nama}`,
            }),
            getKabupatenByNamaAndPage: builder.query<IKabupaten[], string|void>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `kabupaten/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getKabupatenByPropinsi: builder.query<IKabupaten[], string|void>({
                query: (idPropinsi = defaultPropinsi.id) => `kabupaten/propinsi?idPropinsi=${idPropinsi}`,
            }),
        }
    }
})

export const { useGetAllKabupatenQuery, useGetKabupatenByPageQuery, useGetKabupatenByNamaQuery, 
    useGetKabupatenByNamaAndPageQuery, useGetKabupatenByPropinsiQuery } = KabupatenApiSlice