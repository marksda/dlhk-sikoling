import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPegawai } from "./pegawai-slice";


type daftarPegawai = IPegawai[];

export const PegawaiApiSlice = createApi({
    reducerPath: 'pegawaiApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Pegawai'],
    endpoints(builder) {
        return {
            addPegawai: builder.mutation<IPegawai, Partial<IPegawai>>({
                query: (body) => ({
                    url: 'pegawai_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Pegawai', id: 'LIST'}],
            }),
            updatePegawai: builder.mutation<void, Partial<IPegawai>>({
                query: (body) => ({
                    url: 'pegawai_perusahaan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Pegawai', id: id as string}],
            }),
            getAllPegawai: builder.query<daftarPegawai, void>({
                query: () => ({
                    url: 'pegawai_perusahaan',
                    method: 'GET'
                }),
                providesTags: (result) => 
                result ?
                [
                    ...result.map(
                        ({ id }) => ({ type: 'Pegawai' as const, id: id as string})
                    ),
                    { type: 'Pegawai', id: 'LIST' },
                ] :
                [{type: 'Pegawai', id: 'LIST'}],
            }),
            getAllPegawaiByPage: builder.query<daftarPegawai, {page: number; pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => ({
                    url: `pegawai_perusahaan/page?page=${page}&pageSize=${pageSize}`,
                    method: 'GET'
                }),
                providesTags: (result) => 
                result ?
                [
                    ...result.map(
                        ({ id }) => ({ type: 'Pegawai' as const, id: id as string})
                    ),
                    { type: 'Pegawai', id: 'LIST' },
                ] :
                [{type: 'Pegawai', id: 'LIST'}],
            }),
            getPegawaiByIdRegisterPerusahaan: builder.query<daftarPegawai, string>({
                query: (idRegisterPerusahaan) => ({
                    url: `pegawai_perusahaan/idRegisterPerusahaan/${idRegisterPerusahaan}`,
                    method: 'GET'
                }),
                providesTags: (result) => 
                result ?
                [
                    ...result.map(
                        ({ id }) => ({ type: 'Pegawai' as const, id: id as string})
                    ),
                    { type: 'Pegawai', id: 'LIST' },
                ] :
                [{type: 'Pegawai', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddPegawaiMutation, useUpdatePegawaiMutation,
    useGetAllPegawaiQuery, useGetAllPegawaiByPageQuery,
    useGetPegawaiByIdRegisterPerusahaanQuery
} = PegawaiApiSlice;