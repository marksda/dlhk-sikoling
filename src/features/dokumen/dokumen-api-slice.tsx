import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IDokumen } from "./dokumen-slice";

type daftarDokumen = IDokumen[];

export const DokumenApiSlice = createApi({
    reducerPath: 'dokumenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['Dokumen', 'DokumenPage', 'DokumenNama', 'DokumenNamaPage'],
    endpoints(builder) {
        return {
            addDokumen: builder.mutation<IDokumen, Partial<IDokumen>>({
                query: (body) => ({
                    url: 'dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Dokumen', id: 'LIST'}, {type: 'DokumenPage', id: 'LIST'}, {type: 'DokumenNama', id: 'LIST'}, {type: 'DokumenNamaPage', id: 'LIST'}],
            }),
            updateDokumen: builder.mutation<void, Pick<IDokumen, 'id'> & Partial<IDokumen>>({
                query: ({id, ...patch}) => ({
                    url: `dokumen/${id}`,
                    method: 'PUT',
                    patch,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Dokumen', id}, {type: 'DokumenPage', id}, {type: 'DokumenNama', id}, {type: 'DokumenNamaPage', id}],
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'Dokumen', id }, { type: 'DokumenPage', id }, { type: 'DokumenNama', id }, { type: 'DokumenNamaPage', id }],
            }),
            getAllDokumen: builder.query<daftarDokumen, void>({
                query: () => `dokumen`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Dokumen' as const, id })
                        ),
                        { type: 'Dokumen', id: 'LIST' },
                    ]:
                    [{type: 'Dokumen', id: 'LIST'}],
            }),
            getDokumenByPage: builder.query<daftarDokumen, {page: number, pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `dokumen/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'DokumenPage' as const, id })
                        ),
                        { type: 'DokumenPage', id: 'LIST' },
                    ]:
                    [{type: 'DokumenPage', id: 'LIST'}],
            }),
            getDokumenByNama: builder.query<daftarDokumen, string>({
                query: (nama) => `dokumen/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'DokumenNama' as const, id })
                        ),
                        { type: 'DokumenNama', id: 'LIST' },
                    ]:
                    [{type: 'DokumenNama', id: 'LIST'}],
            }),
            getDokumenByNamaAndPage: builder.query<daftarDokumen, {nama: string, page: number, pageSize: number}>({
                query: ({nama = '', page=1, pageSize=10}) => `dokumen/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'DokumenNamaPage' as const, id })
                        ),
                        { type: 'DokumenNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'DokumenNamaPage', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddDokumenMutation, useUpdateDokumenMutation,
    useDeleteKategoriDokumenMutation, useGetAllDokumenQuery,
    useGetDokumenByPageQuery, useGetDokumenByNamaQuery,
    useGetDokumenByNamaAndPageQuery
} = DokumenApiSlice;