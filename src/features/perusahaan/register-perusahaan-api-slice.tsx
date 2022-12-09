import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerusahaan } from "./perusahaan-slice";
import { IRegisterPerusahaan } from "./register-perusahaan-slice";

type daftarRegisterPerusahaan = IRegisterPerusahaan[];

export const RegisterPerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes: ['RegisterPerusahaan', 'RegisterPerusahaanPage', 'RegisterPerusahaanNama', 'RegisterPerusahaanNamaPage', 'RegisterPerusahaanNpwp', 'RegisterPerusahaanByIdPerson'],
    endpoints(builder) {
        return {
            addRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, Partial<IPerusahaan>>({
                query: (body) => ({
                    url: 'register_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}, {type: 'RegisterPerusahaanPage', id: 'LIST'}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}],
            }),
            updateRegisterPerusahaan: builder.mutation<void, Partial<IRegisterPerusahaan>>({
                query: (registerperusahaan) => ({
                    url: 'register_perusahaan',
                    method: 'PUT',
                    body: registerperusahaan,
                }),
                invalidatesTags: (result, error, {perusahaan}) => {
                    let id = perusahaan?.id as string;
                    return [{type: 'RegisterPerusahaan', id}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}];
                },
            }),
            deleteRegisterPerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `register_perusahaan/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{type: 'RegisterPerusahaan', id: id!}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: id!}, {type: 'RegisterPerusahaanNamaPage', id: id!}, {type: 'RegisterPerusahaanNpwp', id: id!}, {type: 'RegisterPerusahaanByIdPerson', id: id!}],
            }),
            getAllRegisterPerusahaan: builder.query<daftarRegisterPerusahaan, void>({
                query: () => 'register_perusahaan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaan' as const, id: perusahaan?.id! })
                        ),
                        { type: 'RegisterPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaan', id: 'LIST'}],
            }),
            getRegisterPerusahaanByPage: builder.query<daftarRegisterPerusahaan, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `register_perusahaan/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaanPage' as const, id: perusahaan?.id! })
                        ),
                        { type: 'RegisterPerusahaanPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanPage', id: 'LIST'}],
            }),
            getRegisterPerusahaanByNama: builder.query<daftarRegisterPerusahaan, string>({
                query: (nama) => `register_perusahaan/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaanNama' as const, id: perusahaan?.id!  })
                        ),
                        { type: 'RegisterPerusahaanNama', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanNama', id: 'LIST'}],
            }),
            getRegisterPerusahaanByNamaAndPage: builder.query<daftarRegisterPerusahaan, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page=1, pageSize=10}) => `register_perusahaan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaanNamaPage' as const, id: perusahaan?.id! })
                        ),
                        { type: 'RegisterPerusahaanNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanNamaPage', id: 'LIST'}],
            }),
            getRegisterPerusahaanById: builder.query<daftarRegisterPerusahaan, string>({
                query: (idRegisterPerusahaan) => `register_perusahaan/${idRegisterPerusahaan}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaanNpwp' as const, id: perusahaan?.id! })
                        ),
                        { type: 'RegisterPerusahaanNpwp', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanNpwp', id: 'LIST'}],
            }),
            getRegisterPerusahaanByIdPerson: builder.query<daftarRegisterPerusahaan, string>({
                query: (idPerson) => ({
                    url: `register_perusahaan/person/${idPerson}`,
                }),                
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan }) => ({ type: 'RegisterPerusahaanByIdPerson' as const, id: perusahaan?.id! })
                        ),
                        { type: 'RegisterPerusahaanByIdPerson', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}],                
            }),
            isEksisRegisterPerusahaan: builder.query<boolean, string|null>({
                query: (idRegisterPerusahaan) => `register_perusahaan/is_eksis?id=${idRegisterPerusahaan}`,
            }),
        }
    }
});

export const {
    useAddRegisterPerusahaanMutation, useUpdateRegisterPerusahaanMutation,
    useDeleteRegisterPerusahaanMutation, useGetAllRegisterPerusahaanQuery, 
    useGetRegisterPerusahaanByPageQuery, useGetRegisterPerusahaanByNamaQuery, 
    useGetRegisterPerusahaanByNamaAndPageQuery, useGetRegisterPerusahaanByIdQuery,
    useIsEksisRegisterPerusahaanQuery, useGetRegisterPerusahaanByIdPersonQuery
} = RegisterPerusahaanApiSlice;