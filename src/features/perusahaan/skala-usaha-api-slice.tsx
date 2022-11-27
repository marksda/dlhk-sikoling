import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";

export interface ISkalaUsaha {
    id: string;
    nama: string;
    singkatan: string;
};

type daftarSkalaUsaha = ISkalaUsaha[];

export const SkalaUsahaApiSlice = createApi({
    reducerPath: 'skalaUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['SkalaUsaha', 'SkalaUsahaPage', 'SkalaUsahaNama', 'SkalaUsahaNamaPage'],
    endpoints(builder) {
        return {
            addSkalaUsaha: builder.mutation<ISkalaUsaha, Partial<ISkalaUsaha>>({
                query: (body) => ({
                    url: 'skala_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'SkalaUsaha', id: 'LIST'}, {type: 'SkalaUsahaPage', id: 'LIST'}, {type: 'SkalaUsahaNama', id: 'LIST'}, {type: 'SkalaUsahaNamaPage', id: 'LIST'}],
            }),
            updateSkalaUsaha: builder.mutation<void, {id: string; skalaUsaha: ISkalaUsaha}>({
                query: ({id, skalaUsaha}) => ({
                    url: `skala_usaha/${id}`,
                    method: 'PUT',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'SkalaUsaha', id}, {type: 'SkalaUsahaPage', id}, {type: 'SkalaUsahaNama', id}, {type: 'SkalaUsahaNamaPage', id}],
            }),
            deleteSkalaUsaha: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `skala_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{type: 'SkalaUsaha', id}, {type: 'SkalaUsahaPage', id}, {type: 'SkalaUsahaNama', id}, {type: 'SkalaUsahaNamaPage', id}],
            }),
            getAllSkalaUsaha: builder.query<daftarSkalaUsaha, void>({
                query: () => `skala_usaha`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'SkalaUsaha' as const, id })
                        ),
                        { type: 'SkalaUsaha', id: 'LIST' },
                    ]:
                    [{type: 'SkalaUsaha', id: 'LIST'}],
            }),
            getSkalaUsahaByPage: builder.query<daftarSkalaUsaha, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `skala_usaha/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'SkalaUsahaPage' as const, id })
                        ),
                        { type: 'SkalaUsahaPage', id: 'LIST' },
                    ]:
                    [{type: 'SkalaUsahaPage', id: 'LIST'}],
            }),
            getSkalaUsahaByNama: builder.query<daftarSkalaUsaha, string>({
                query: (nama) => `skala_usaha/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'SkalaUsahaNama' as const, id })
                        ),
                        { type: 'SkalaUsahaNama', id: 'LIST' },
                    ]:
                    [{type: 'SkalaUsahaNama', id: 'LIST'}],
            }),
            getSkalaUsahaByNamaAndPage: builder.query<daftarSkalaUsaha, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page, pageSize}) => `skala_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'SkalaUsahaNamaPage' as const, id })
                        ),
                        { type: 'SkalaUsahaNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'SkalaUsahaNamaPage', id: 'LIST'}],
            })
        }
    }
});

export const { 
    useAddSkalaUsahaMutation, useUpdateSkalaUsahaMutation,
    useDeleteSkalaUsahaMutation, useGetAllSkalaUsahaQuery, 
    useGetSkalaUsahaByPageQuery, useGetSkalaUsahaByNamaQuery,
    useGetSkalaUsahaByNamaAndPageQuery
} = SkalaUsahaApiSlice;