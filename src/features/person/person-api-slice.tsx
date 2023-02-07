import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerson } from "./person-slice";


export const PersonApiSlice = createApi({
    reducerPath: 'personApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    endpoints(builder) {
        return {
            getAllPerson: builder.query<IPerson[], number|void>({
                query: () => `person`,
            }),
            getPersonByPage: builder.query<IPerson[], number|void>({
                query: (page = 1, pageSize = 10) => `person/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPersonByNama: builder.query<IPerson[], string|void>({
                query: (nama) => `person/nama?nama=${nama}`,
            }),
            getPersonByNamaAndPage: builder.query<IPerson[], string|void>({
                query: (nama, page=1, pageSize=10) => `person/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPersonByNik: builder.query<IPerson, string>({
                query: (nik) => `person/nik/${nik}`,
            }),
            getPersonByPemrakarsa: builder.query<IPerson[], string|void>({
                query: (idPemrakarsa) => `person/pemrakarsa?idPemrakarsa=${idPemrakarsa}`,
            }),
            addPerson: builder.mutation({
                query: (body) => ({
                    url: 'person',
                    method: 'POST',
                    body,
                })
            }),
        }
    }
})

export const { 
    useGetAllPersonQuery, useGetPersonByPageQuery, useGetPersonByNamaQuery,
    useGetPersonByNikQuery, useGetPersonByNamaAndPageQuery, useGetPersonByPemrakarsaQuery, 
    useAddPersonMutation 
} = PersonApiSlice;