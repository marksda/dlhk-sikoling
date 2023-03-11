import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IRegisterDokumen } from "../dokumen/register-dokumen-slice";
import { IStatusFlowLog } from "../log/status-flow-log-api-slice";
import { IPegawai } from "../pegawai/pegawai-slice";
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
    pengirimBerkas: Partial<IPosisiTahapPemberkasan>|null;
    penerimaBerkas: Partial<IPosisiTahapPemberkasan>|null;
    statusFlowLog: Partial<IStatusFlowLog>|null;
    daftarDokumenSyarat: IRegisterDokumen[]|null;
    daftarDokumenHasil: IRegisterDokumen[]|null;
};

export interface IRegisterPermohonanArahan extends IRegisterPermohonan {
    jenisPermohonanSuratArahan: IJenisPermohonanSuratArahan|null;
    uraianKegiatan: string|null;
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
            getRegisterPermohonanByPenerima: builder.query<daftarRegisterPermohonan, string>({
                query: (idPenerima) => `register_permohonan/penerima/${idPenerima}`,
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
            getRegisterPermohonanByPengirim: builder.query<daftarRegisterPermohonan, string>({
                query: (idPengirim) => `register_permohonan/pengirim/${idPengirim}`,
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
            getRegisterPermohonanByPengirimAtauPenerima: builder.query<daftarRegisterPermohonan, {idPengirim: string; idPenerima: string}>({
                query: ({idPengirim, idPenerima}) => `register_permohonan/pengirim_penerima/${idPengirim}/${idPenerima}`,
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
    useGetRegisterPermohonanByRegisterPerusahaanQuery, useGetRegisterPermohonanByPenerimaQuery,
    useGetRegisterPermohonanByPengirimQuery, useGetRegisterPermohonanByPengirimAtauPenerimaQuery
} = RegisterPermohonanApiSlice;
