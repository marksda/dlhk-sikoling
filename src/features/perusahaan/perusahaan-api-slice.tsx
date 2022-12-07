import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerusahaan } from "./perusahaan-slice";

type daftarPerusahaan = IPerusahaan[];

export const PerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['Perusahaan', 'PerusahaanPage', 'PerusahaanNama', 'PerusahaanNamaPage', 'PerusahaanNpwp', 'PerusahaanByIdPerson'],
    endpoints(builder) {
        return {
            addPerusahaan: builder.mutation<IPerusahaan, Partial<IPerusahaan>>({
                query: (body) => ({
                    url: 'perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Perusahaan', id: 'LIST'}, {type: 'PerusahaanPage', id: 'LIST'}, {type: 'PerusahaanNama', id: 'LIST'}, {type: 'PerusahaanNamaPage', id: 'LIST'}, {type: 'PerusahaanNpwp', id: 'LIST'}, {type: 'PerusahaanByIdPerson', id: 'LIST'}],
            }),
            updatePerusahaan: builder.mutation<void, {id: string; perusahaan: IPerusahaan;}>({
                query: ({id, perusahaan}) => ({
                    url: `perusahaan/${id}`,
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Perusahaan', id}, {type: 'PerusahaanPage', id}, {type: 'PerusahaanNama', id: 'LIST'}, {type: 'PerusahaanNamaPage', id: 'LIST'}, {type: 'PerusahaanNpwp', id: 'LIST'}, {type: 'PerusahaanByIdPerson', id: 'LIST'}],
            }),
            deletePerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `perusahaan/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{type: 'Perusahaan', id: id!}, {type: 'PerusahaanPage', id}, {type: 'PerusahaanNama', id: id!}, {type: 'PerusahaanNamaPage', id: id!}, {type: 'PerusahaanNpwp', id: id!}, {type: 'PerusahaanByIdPerson', id: id!}],
            }),
            getAllPerusahaan: builder.query<daftarPerusahaan, void>({
                query: () => `perusahaan`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Perusahaan' as const, id: id! })
                        ),
                        { type: 'Perusahaan', id: 'LIST' },
                    ]:
                    [{type: 'Perusahaan', id: 'LIST'}],
            }),
            getPerusahaanByPage: builder.query<daftarPerusahaan, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `perusahaan/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PerusahaanPage' as const, id: id! })
                        ),
                        { type: 'PerusahaanPage', id: 'LIST' },
                    ]:
                    [{type: 'PerusahaanPage', id: 'LIST'}],
            }),
            getPerusahaanByNama: builder.query<daftarPerusahaan, string>({
                query: (nama) => `perusahaan/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PerusahaanNama' as const, id: id! })
                        ),
                        { type: 'PerusahaanNama', id: 'LIST' },
                    ]:
                    [{type: 'PerusahaanNama', id: 'LIST'}],
            }),
            getPerusahaanByNamaAndPage: builder.query<daftarPerusahaan, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page=1, pageSize=10}) => `perusahaan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PerusahaanNamaPage' as const, id: id! })
                        ),
                        { type: 'PerusahaanNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'PerusahaanNamaPage', id: 'LIST'}],
            }),
            getPerusahaanById: builder.query<daftarPerusahaan, string>({
                query: (idPerusahaan) => `perusahaan/${idPerusahaan}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PerusahaanNpwp' as const, id: id! })
                        ),
                        { type: 'PerusahaanNpwp', id: 'LIST' },
                    ]:
                    [{type: 'PerusahaanNpwp', id: 'LIST'}],
            }),
            getPerusahaanByIdPerson: builder.query<daftarPerusahaan, string>({
                query: (idPerson) => ({
                    url: `perusahaan/person/${idPerson}`,
                }),                
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PerusahaanByIdPerson' as const, id: id! })
                        ),
                        { type: 'PerusahaanByIdPerson', id: 'LIST' },
                    ]:
                    [{type: 'PerusahaanByIdPerson', id: 'LIST'}],                
            }),
            isEksisPerusahaan: builder.query<boolean, string|null>({
                query: (idPerusahaan) => `perusahaan/is_eksis?id=${idPerusahaan}`,
            }),
        }
    }
});

export const { 
    useAddPerusahaanMutation, useUpdatePerusahaanMutation,
    useDeletePerusahaanMutation, useGetAllPerusahaanQuery, 
    useGetPerusahaanByPageQuery, useGetPerusahaanByNamaQuery, 
    useGetPerusahaanByNamaAndPageQuery, useGetPerusahaanByIdQuery,
    useIsEksisPerusahaanQuery, useGetPerusahaanByIdPersonQuery
} = PerusahaanApiSlice;