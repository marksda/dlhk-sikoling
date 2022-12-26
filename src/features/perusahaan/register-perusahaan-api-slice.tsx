import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerson } from "../person/person-slice";
import { IPerusahaan } from "./perusahaan-slice";
import { IRegisterPerusahaan } from "./register-perusahaan-slice";

type daftarRegisterPerusahaan = IRegisterPerusahaan[];

export const RegisterPerusahaanApiSlice = createApi({
    reducerPath: 'registerPerusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['RegisterPerusahaan', 'RegisterPerusahaanPage', 'RegisterPerusahaanNama', 'RegisterPerusahaanNamaPage', 'RegisterPerusahaanNpwp', 'RegisterPerusahaanByIdPerson', 'RegisterPerusahaanByIdLinkKepemilikan'],
    endpoints(builder) {
        return {
            addRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, Partial<IPerusahaan>>({
                query: (body) => ({
                    url: 'register_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}, {type: 'RegisterPerusahaanPage', id: 'LIST'}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST'}],
            }),
            updateRegisterPerusahaan: builder.mutation<void, Partial<IPerusahaan>>({
                query: (perusahaan) => ({
                    url: 'register_perusahaan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, perusahaan) => {
                    let id = perusahaan?.id as string;
                    return [{type: 'RegisterPerusahaan', id}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST'}];
                },
            }),
            deleteRegisterPerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idPerusahaan) {
                  return {
                    url: `register_perusahaan/${idPerusahaan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idPerusahaan) => {
                    let id = result?.id;
                    return [{type: 'RegisterPerusahaan', id: id}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: id}, {type: 'RegisterPerusahaanNamaPage', id: id}, {type: 'RegisterPerusahaanNpwp', id: id}, {type: 'RegisterPerusahaanByIdPerson', id: id}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: id}]
                },
            }),
            deleteLinkKepemilikanRegisterPerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idRegisterPerusahaan) {
                  return {
                    url: `register_perusahaan/kepemilikan/${idRegisterPerusahaan}`,
                    method: 'DELETE'
                  }
                },
                invalidatesTags: (result, error, id) => {
                    // let id = result?.id;
                    return [{type: 'RegisterPerusahaanByIdLinkKepemilikan', id: id}]},
            }),
            getAllRegisterPerusahaan: builder.query<daftarRegisterPerusahaan, void>({
                query: () => 'register_perusahaan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPerusahaan' as const, id: id as string })
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
            getRegisterPerusahaanByNpwp: builder.query<daftarRegisterPerusahaan, string>({
                query: (npwp) => `register_perusahaan/${npwp}`,
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
            getRegisterPerusahaanByIdKreator: builder.query<daftarRegisterPerusahaan, string>({
                query: (idKreator) => ({
                    url: `register_perusahaan/kreator/${idKreator}`,
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
            getRegisterPerusahaanByIdLinkKepemilikan: builder.query<daftarRegisterPerusahaan, string>({
                query: (idLinkKepemilikan) => ({
                    url: `register_perusahaan/kepemilikan/${idLinkKepemilikan}`,
                }),
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({ type: 'RegisterPerusahaanByIdLinkKepemilikan' as const, id: id as string })
                        ),
                        { type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST'}],                
            }),
            addLinkKepemilikanPerusahaan: builder.mutation<IRegisterPerusahaan, { perusahaan: Partial<IPerusahaan>, pemilik: Partial<IPerson>}>({
                query: (item) => ({
                    url: 'register_perusahaan/add_kepemilikan',
                    method: 'POST',
                    body: item,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}, {type: 'RegisterPerusahaanPage', id: 'LIST'}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddRegisterPerusahaanMutation, useUpdateRegisterPerusahaanMutation,
    useDeleteRegisterPerusahaanMutation, useGetAllRegisterPerusahaanQuery, 
    useGetRegisterPerusahaanByPageQuery, useGetRegisterPerusahaanByNamaQuery, 
    useGetRegisterPerusahaanByNamaAndPageQuery, useGetRegisterPerusahaanByNpwpQuery,
    useIsEksisRegisterPerusahaanQuery, useGetRegisterPerusahaanByIdKreatorQuery,
    useGetRegisterPerusahaanByIdLinkKepemilikanQuery, useDeleteLinkKepemilikanRegisterPerusahaanMutation,
} = RegisterPerusahaanApiSlice;