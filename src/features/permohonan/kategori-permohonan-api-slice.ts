import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";

export interface IKategoriPermohonan {
    id: string|null;
    nama: string|null;
}

type daftarKategoriPermohonan = IKategoriPermohonan[];

export const KategoriPermohonanApiSlice = createApi({
    reducerPath: 'kategoriPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes: ['KategoriPermohonan'],
    endpoints(builder) {
        return {
            addKategoriPermohonan: builder.mutation<IKategoriPermohonan, Partial<IKategoriPermohonan>>({
                query: (body) => ({
                    url: 'kategori_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'KategoriPermohonan', id: 'LIST'}],
            }),
            updateKategoriPermohonan: builder.mutation<void, Partial<IKategoriPermohonan>>({
                query: (perusahaan) => ({
                    url: 'kategori_permohonan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'KategoriPermohonan', id: id!}];
                },
            }),
            getAllKategoriPermohonan: builder.query<daftarKategoriPermohonan, void>({
                query: () => 'kategori_permohonan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPermohonan' as const, id: id! })
                        ),
                        { type: 'KategoriPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPermohonan', id: 'LIST'}],
            }),
            getKategoriPermohonanByNama: builder.query<daftarKategoriPermohonan, string>({
                query: (nama) => `kategori_permohonan/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'KategoriPermohonan' as const, id: id!  })
                        ),
                        { type: 'KategoriPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'KategoriPermohonan', id: 'LIST'}],
            }),
            deleteKategoriPermohonan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idKategoriPermohonan) {
                  return {
                    url: `kategori_permohonan/${idKategoriPermohonan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idKategoriPermohonan) => {
                    return [{type: 'KategoriPermohonan', id: idKategoriPermohonan}]
                },
            }),
        };
    }
});

export const {
    useAddKategoriPermohonanMutation, useUpdateKategoriPermohonanMutation,
    useGetAllKategoriPermohonanQuery, useGetKategoriPermohonanByNamaQuery,
    useDeleteKategoriPermohonanMutation
} = KategoriPermohonanApiSlice;