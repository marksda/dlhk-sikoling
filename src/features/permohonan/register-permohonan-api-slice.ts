import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPegawai } from "../pegawai/pegawai-api-slice";
import { IPerson } from "../person/person-slice";
import { IRegisterPerusahaan } from "../perusahaan/register-perusahaan-slice";
import { IJenisPermohonanSuratArahan } from "./jenis-permohonan-surat-arahan-api-slice";
import { IKategoriPermohonan } from "./kategori-permohonan-api-slice";
import { IPosisiTahapPemberkasan } from "./posisi-tahap-pemberkasan-api-slice";
import { IStatusWali } from "./status-wali-api-slice";

export interface IRegisterPermohonan {
    id: string|null;
    kategoriPermohonan: Partial<IKategoriPermohonan>|null;
    tanggalRegistrasi: string|null,
    registerPerusahaan: Partial<IRegisterPerusahaan>|null;
    pengurusPermohonan:any|null;
    statusWali: Partial<IStatusWali>|null;
    penanggungJawabPermohonan: Partial<IPegawai>|null;
    statusTahapPemberkasan: Partial<IPosisiTahapPemberkasan>|null;
    daftarDokumenSyarat: any[]|null;
    daftarDokumenHasil: any[]|null;
};

export interface IRegisterPermohonanSuratArahan extends IRegisterPermohonan {
    jenisPermohonanSuratArahan: IJenisPermohonanSuratArahan|null;
}

type daftarRegisterPermohonan = IRegisterPermohonan[];

export const RegisterPermohonanApiSlice = createApi({
    reducerPath: 'registerPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    // keepUnusedDataFor: 30,
    tagTypes: ['RegisterPermohonan', 'RegisterPermohonanPage'],
    endpoints(builder) {
        return {
            addRegisterPermohonan: builder.mutation<IRegisterPermohonan, Partial<IRegisterPermohonan>>({
                query: (body) => ({
                    url: 'register_permohonan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterPermohonan', id: 'LIST'}],
            }),
            updateRegisterPermohonan: builder.mutation<void, Partial<IRegisterPermohonan>>({
                query: (perusahaan) => ({
                    url: 'register_permohonan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'RegisterPermohonan', id: id!}];
                },
            }),
            deleteRegisterPermohonan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idRegisterPermohonan) {
                  return {
                    url: `register_permohonan/${idRegisterPermohonan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idRegisterPermohonan) => {
                    return [{type: 'RegisterPermohonan', id: idRegisterPermohonan}]
                },
            }),
            getAllRegisterPermohonan: builder.query<daftarRegisterPermohonan, void>({
                query: () => 'register_permohonan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPermohonan' as const, id: id! })
                        ),
                        { type: 'RegisterPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPermohonan', id: 'LIST'}],
            }),
            getRegisterPermohonanByPage: builder.query<daftarRegisterPermohonan, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `register_permohonan/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPermohonanPage' as const, id: id! })
                        ),
                        { type: 'RegisterPermohonanPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPermohonanPage', id: 'LIST'}],
            }),
            getRegisterPermohonanByUser: builder.query<daftarRegisterPermohonan, string>({
                query: (idUser) => `register_permohonan/user/${idUser}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPermohonan' as const, id: id!  })
                        ),
                        { type: 'RegisterPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPermohonan', id: 'LIST'}],
            }),
            getRegisterPermohonanByRegisterPerusahaan: builder.query<daftarRegisterPermohonan, string>({
                query: (idRegister) => `register_permohonan/perusahaan/${idRegister}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPermohonan' as const, id: id!  })
                        ),
                        { type: 'RegisterPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPermohonan', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddRegisterPermohonanMutation, useUpdateRegisterPermohonanMutation,
    useDeleteRegisterPermohonanMutation, useGetAllRegisterPermohonanQuery,
    useGetRegisterPermohonanByPageQuery, useGetRegisterPermohonanByUserQuery,
    useGetRegisterPermohonanByRegisterPerusahaanQuery
} = RegisterPermohonanApiSlice;
