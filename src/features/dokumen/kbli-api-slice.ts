import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IKbli } from "./kbli-slice";

type daftarKbli = IKbli[];

export const KbliApiSlice = createApi({
    reducerPath: 'kbliApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['Kbli', 'KbliPage', 'KbliNama', 'KbliNamaPage', 'KbliKode', 'KbliKodePage', 'KbliKategori', 'KbliKategoriPage'],
    endpoints(builder) {
        return {
            addKbli: builder.mutation<IKbli, Partial<IKbli>>({
                query: (body) => ({
                    url: 'kbli',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kbli', id: 'LIST'}, {type: 'KbliPage', id: 'LIST'}, {type: 'KbliNama', id: 'LIST'}, {type: 'KbliNamaPage', id: 'LIST'}, {type: 'KbliKode', id: 'LIST'}, {type: 'KbliKodePage', id: 'LIST'}, {type: 'KbliKategori', id: 'LIST'}, {type: 'KbliKategoriPage', id: 'LIST'}]
            }),
            updateKbli: builder.mutation<void, {kode: string; kbli: IKbli}>({
                query: ({kode, kbli}) => ({
                    url: `kbli/${kode}`,
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result, error, { kode }) => [{type: 'Kbli', id: kode}, {type: 'KbliPage', id: kode}, {type: 'KbliNama', id: kode}, {type: 'KbliNamaPage', id: kode}, {type: 'KbliKode', id: kode}, {type: 'KbliKodePage', id: kode}, {type: 'KbliKategori', id: kode}, {type: 'KbliKategoriPage', id: kode}]
            }),
            deleteKbli: builder.mutation<{ success: boolean; id: string }, string>({
                query(kode) {
                  return {
                    url: `kbli/${kode}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{type: 'Kbli', id}, {type: 'KbliPage', id}, {type: 'KbliNama', id}, {type: 'KbliNamaPage', id}, {type: 'KbliKode', id}, {type: 'KbliKodePage', id}, {type: 'KbliKategori', id}, {type: 'KbliKategoriPage', id}]
            }),
            getAllKbli: builder.query<daftarKbli, void>({
                query: () => `kbli`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'Kbli' as const, id: kode })
                        ),
                        { type: 'Kbli', id: 'LIST' },
                    ]:
                    [{type: 'Kbli', id: 'LIST'}],
            }),
            getKbliByPage: builder.query<daftarKbli, {page: number; pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `kbli/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliPage' as const, id: kode })
                        ),
                        { type: 'KbliPage', id: 'LIST' },
                    ]:
                    [{type: 'KbliPage', id: 'LIST'}],
            }),
            getKbliByNama: builder.query<daftarKbli, string>({
                query: (nama) => `kbli/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliNama' as const, id: kode })
                        ),
                        { type: 'KbliNama', id: 'LIST' },
                    ]:
                    [{type: 'KbliNama', id: 'LIST'}],
            }),
            getKbliByNamaAndPage: builder.query<daftarKbli, {nama: string; page: number; pageSize: number}>({
                query: ({nama = '', page=1, pageSize=10}) => `kbli/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliNamaPage' as const, id: kode })
                        ),
                        { type: 'KbliNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'KbliNamaPage', id: 'LIST'}],
            }),
            getKbliByKode: builder.query<daftarKbli, string>({
                query: (kode) => `kbli/kode?kode=${kode}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliKode' as const, id: kode })
                        ),
                        { type: 'KbliKode', id: 'LIST' },
                    ]:
                    [{type: 'KbliKode', id: 'LIST'}],
            }),
            getKbliByKodeAndPage: builder.query<daftarKbli, {kode: string; page: number; pageSize: number}>({
                query: ({kode = '', page=1, pageSize=10}) => `kbli/kode?kode=${kode}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliKodePage' as const, id: kode })
                        ),
                        { type: 'KbliKodePage', id: 'LIST' },
                    ]:
                    [{type: 'KbliKodePage', id: 'LIST'}],
            }),
            getKbliByKategori: builder.query<daftarKbli, string>({
                query: (kategori) => `kbli/kategori?kategori=${kategori}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliKategori' as const, id: kode })
                        ),
                        { type: 'KbliKategori', id: 'LIST' },
                    ]:
                    [{type: 'KbliKategori', id: 'LIST'}],
            }),
            getKbliByKategoriAndPage: builder.query<daftarKbli, {kategori: string; page: number; pageSize: number}>({
                query: ({kategori = '', page=1, pageSize=10}) => `kbli/kategori?kategori=${kategori}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'KbliKategoriPage' as const, id: kode })
                        ),
                        { type: 'KbliKategoriPage', id: 'LIST' },
                    ]:
                    [{type: 'KbliKategoriPage', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddKbliMutation, 
    useUpdateKbliMutation, 
    useDeleteKbliMutation,
    useGetAllKbliQuery, 
    useGetKbliByPageQuery, 
    useGetKbliByNamaQuery,
    useGetKbliByNamaAndPageQuery, 
    useGetKbliByKodeQuery, 
    useGetKbliByKodeAndPageQuery,
    useGetKbliByKategoriQuery, 
    useGetKbliByKategoriAndPageQuery
} = KbliApiSlice;