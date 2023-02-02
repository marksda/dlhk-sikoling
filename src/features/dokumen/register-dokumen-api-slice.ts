import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { baseQueryWithReauth } from "../config/helper-function";
import { IRegisterDokumen } from "./register-dokumen-slice";

type daftarRegisterDokumen = IRegisterDokumen[];

export const RegisterDokumenApiSlice = createApi({
    reducerPath: 'registerDokumenApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['RegisterDokumen', 'RegisterDokumenPage', 'RegisterDokumenNama', 'RegisterDokumenNamaPage', 'RegisterDokumenIdDokumen', 'RegisterDokumenIdDokumenPage', 'RegisterDokumenPerusahaan', 'RegisterDokumenPerusahaanPage', 'RegisterDokumenIdPerusahaan', 'RegisterDokumenIdPerusahaanPage'],
    endpoints(builder) {
        return {
            uploadFileDokumenWithSecurity: builder.mutation<{}, {idRegisterDokumen: string; npwpPerusahaan: string; formData: FormData;}>({
                query({idRegisterDokumen, npwpPerusahaan, formData}) {
                  return {
                    url: `files/sec/dok/${npwpPerusahaan}/${idRegisterDokumen}`,
                    method: 'POST',
                    body: formData,
                  };
                },
            }),
            addRegisterDokumen: builder.mutation<IRegisterDokumen, Partial<IRegisterDokumen>>({
                query: (body) => ({
                    url: 'register_dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterDokumen', id: 'LIST'}, {type: 'RegisterDokumenPage', id: 'LIST'}, {type: 'RegisterDokumenNama', id: 'LIST'}, {type: 'RegisterDokumenNamaPage', id: 'LIST'}, {type: 'RegisterDokumenIdDokumen', id: 'LIST'}, {type: 'RegisterDokumenIdDokumenPage', id: 'LIST'}, {type: 'RegisterDokumenPerusahaan', id: 'LIST'}, {type: 'RegisterDokumenPerusahaanPage', id: 'LIST'}, {type: 'RegisterDokumenIdPerusahaan', id: 'LIST'}, {type: 'RegisterDokumenIdPerusahaanPage', id: 'LIST'}],
            }),
            updateRegisterDokumen: builder.mutation<void, IRegisterDokumen>({
                query: (registerDokumen) => ({
                    url: `register_dokumen`,
                    method: 'PUT',
                    body: registerDokumen,
                }),
                invalidatesTags: (result, error, { perusahaan, dokumen }) => [{type: 'RegisterDokumen', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenPage', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenNama', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenNamaPage', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenIdDokumen', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenIdDokumenPage', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenPerusahaan', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenPerusahaanPage', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenIdPerusahaan', id: `${perusahaan?.id}*${dokumen?.id}`}, {type: 'RegisterDokumenIdPerusahaanPage', id: `${perusahaan?.id}*${dokumen?.id}`}],
            }),
            deleteRegisterDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `register_dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'RegisterDokumen', id }, { type: 'RegisterDokumenPage', id }, { type: 'RegisterDokumenNama', id }, { type: 'RegisterDokumenNamaPage', id }, { type: 'RegisterDokumenIdDokumen', id }, { type: 'RegisterDokumenIdDokumenPage', id }, {type: 'RegisterDokumenPerusahaan', id }, { type: 'RegisterDokumenPerusahaanPage', id }, { type: 'RegisterDokumenIdPerusahaan', id }, { type: 'RegisterDokumenIdPerusahaanPage', id }],
            }),
            getAllRegisterDokumen: builder.query<daftarRegisterDokumen, void>({
                query: () => `register_dokumen`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumen' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumen', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumen', id: 'LIST'}],
            }),
            getRegisterDokumenByPage: builder.query<daftarRegisterDokumen, {page: number; pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `register_dokumen/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenPage' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenPage', id: 'LIST'}],
            }),
            getRegisterDokumenByPerusahaan: builder.query<daftarRegisterDokumen, string>({
                query: (namaPerusahaan) => `register_dokumen/perusahaan/nama?namaPerusahaan=${namaPerusahaan}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenPerusahaan' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenPerusahaan', id: 'LIST'}],
            }),
            getRegisterDokumenByPerusahaanAndPage: builder.query<daftarRegisterDokumen, {namaPerusahaan: string; page: number; pageSize: number}>({
                query: ({namaPerusahaan, page, pageSize}) => `register_dokumen/perusahaan/nama/page?namaPerusahaan=${namaPerusahaan}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenPerusahaanPage' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenPerusahaanPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenPerusahaanPage', id: 'LIST'}],
            }),
            getRegisterDokumenByIdPerusahaan: builder.query<daftarRegisterDokumen, string>({
                query: (idPerusahaan) => `register_dokumen/perusahaan/id?idPerusahaan=${idPerusahaan}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenIdPerusahaan' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenIdPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenIdPerusahaan', id: 'LIST'}],
            }),
            getRegisterDokumenByIdPerusahaanAndPage: builder.query<daftarRegisterDokumen, {idPerusahaan: string; page: number; pageSize: number}>({
                query: ({idPerusahaan, page, pageSize}) => `register_dokumen/perusahaan/id/page?idPerusahaan=${idPerusahaan}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenIdPerusahaanPage' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenIdPerusahaanPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenIdPerusahaanPage', id: 'LIST'}],
            }),
            getRegisterDokumenByDokumen: builder.query<daftarRegisterDokumen, string>({
                query: (namaDokumen) => `register_dokumen/dokumen/nama?namaDokumen=${namaDokumen}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenNama' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenNama', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenNama', id: 'LIST'}],
            }),
            getRegisterDokumenByDokumenAndPage: builder.query<daftarRegisterDokumen, {namaDokumen: string; page: number; pageSize: number}>({
                query: ({namaDokumen, page, pageSize}) => `register_dokumen/dokumen/page?namaDokumen=${namaDokumen}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenNamaPage' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenNamaPage', id: 'LIST'}],
            }),
            getRegisterDokumenByIdDokumen: builder.query<daftarRegisterDokumen, string>({
                query: (idDokumen) => `register_dokumen/dokumen/id?idDokumen=${idDokumen}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenIdDokumen' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenIdDokumen', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenIdDokumen', id: 'LIST'}],
            }),
            getRegisterDokumenByIdDokumenAndPage: builder.query<daftarRegisterDokumen, {idDokumen: string; page: number; pageSize: number}>({
                query: ({idDokumen, page, pageSize}) => `register_dokumen/dokumen/id/page?idDokumen=${idDokumen}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ perusahaan, dokumen }) => ({ type: 'RegisterDokumenIdDokumenPage' as const, id: `${perusahaan?.id}*${dokumen?.id}` })
                        ),
                        { type: 'RegisterDokumenIdDokumenPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenIdDokumenPage', id: 'LIST'}],
            }),
        };
    }
});

export const {
    useUploadFileDokumenWithSecurityMutation, useAddRegisterDokumenMutation, 
    useUpdateRegisterDokumenMutation, useDeleteRegisterDokumenMutation, useGetAllRegisterDokumenQuery,
    useGetRegisterDokumenByPageQuery, useGetRegisterDokumenByPerusahaanQuery,
    useGetRegisterDokumenByPerusahaanAndPageQuery, useGetRegisterDokumenByIdPerusahaanQuery,
    useGetRegisterDokumenByIdPerusahaanAndPageQuery, useGetRegisterDokumenByDokumenQuery,
    useGetRegisterDokumenByDokumenAndPageQuery, useGetRegisterDokumenByIdDokumenQuery,
    useGetRegisterDokumenByIdDokumenAndPageQuery
} = RegisterDokumenApiSlice;