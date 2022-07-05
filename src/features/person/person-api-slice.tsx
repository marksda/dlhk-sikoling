import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../config/config";
import { IPerson } from "./person-slice";


export const PersonApiSlice = createApi({
    reducerPath: 'personApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
    }),
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

export const { useGetAllPersonQuery, useGetPersonByPageQuery, useGetPersonByNamaQuery,
    useGetPersonByNamaAndPageQuery, useGetPersonByPemrakarsaQuery, useAddPersonMutation } = PersonApiSlice;