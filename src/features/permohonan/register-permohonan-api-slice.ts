import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";
import { IRegisterDokumen } from "../dokumen/register-dokumen-slice";
import { IStatusFlowLog } from "../log/status-flow-log-api-slice";
import { IPegawai } from "../repository/ssot/pegawai-slice";
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
            getAllRegisterPermohonan: builder.query<daftarRegisterPermohonan, IQueryParams>({
                query: (queryParams) => `register_permohonan?filters=${JSON.stringify(queryParams)}`,
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
            getTotalCountRegisterPermohonan: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `register_permohonan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddRegisterPermohonanMutation, useUpdateRegisterPermohonanMutation,
    useDeleteRegisterPermohonanMutation, useGetAllRegisterPermohonanQuery,
    useGetTotalCountRegisterPermohonanQuery,
} = RegisterPermohonanApiSlice;