import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl, defaultPropinsi } from "../config/config";
import { IKabupaten } from "./kabupaten-slice";

type daftarKabupaten = IKabupaten[];
export const KabupatenApiSlice = createApi({
    reducerPath: 'kabupatenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getAllKabupaten: builder.query<daftarKabupaten, void>({
                query: () => `kabupaten`,
            }),
            getKabupatenByPage: builder.query<daftarKabupaten, number|void>({
                query: (page = 1, pageSize = 10) => `kabupaten/page?page=${page}&pageSize=${pageSize}`,
            }),
            getKabupatenByNama: builder.query<daftarKabupaten, string|void>({
                query: (nama = 'jawa timur') => `kabupaten/nama?nama=${nama}`,
            }),
            getKabupatenByNamaAndPage: builder.query<daftarKabupaten, string|void>({
                query: (nama = 'jawa timur', page=1, pageSize=10) => `kabupaten/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getKabupatenByPropinsi: builder.query<daftarKabupaten, string|void>({
                query: (idPropinsi = defaultPropinsi.id!) => `kabupaten/propinsi?idPropinsi=${idPropinsi}`,
            }),
            getKabupatenByPropinsiAndPage: builder.query<daftarKabupaten, string|void>({
                query: (idPropinsi = defaultPropinsi.id!) => `kabupaten/propinsi?idPropinsi=${idPropinsi}`,
            }),
        }
    }
})

export const { useGetAllKabupatenQuery, useGetKabupatenByPageQuery, useGetKabupatenByNamaQuery, 
    useGetKabupatenByNamaAndPageQuery, useGetKabupatenByPropinsiQuery } = KabupatenApiSlice