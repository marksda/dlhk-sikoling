import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";
import { IPropinsi } from "../../entity/propinsi";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { IKabupaten } from "../../entity/kabupaten";
import { IKecamatan } from "../../entity/kecamatan";
import { IDesa } from "../../entity/desa";
import { IJenisKelamin } from "../../entity/jenis-kelamin";

export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Desa', 'Kabupaten', 'Kecamatan','Person', 'Propinsi', 'Sex'],
    endpoints: builder => {
        return {
            saveJenisKelamin: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Sex', id: 'LIST'}]
            }),
            updateJenisKelamin: builder.mutation<void, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Sex', id: id!}]
            }),
            updateIdJenisKelamin: builder.mutation<IJenisKelamin, {idLama: String; sex: IJenisKelamin}>({
                query: ({idLama, sex}) => ({
                    url: `sex/id/${idLama}`,
                    method: 'PUT',
                    body: sex,
                }),
                invalidatesTags: (result, error, { sex }) => {
                    return [{type: 'Sex', id: sex.id!}];
                }
            }),
            deleteJenisKelamin: builder.mutation<Partial<IJenisKelamin>, Partial<IJenisKelamin>>({
                query: (sex) => ({                  
                    url: `sex/${sex.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Sex', id: id!}]
            }),
            getDaftarDataJenisKelamin: builder.query<IJenisKelamin[], IQueryParamFilters>({
                query: (queryParams) => `sex?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({ type: 'Sex' as const, id: id!})
                        ),
                        { type: 'Sex', id: 'LIST' },
                    ]:
                    [{type: 'Sex', id: 'LIST'}],
            }),
            getJumlahDataJenisKelamin: builder.query<number, qFilters>({
                query: (queryFilters) => `sex/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePropinsi: builder.mutation<IPropinsi, Partial<IPropinsi>>({
                query: (body) => ({
                    url: 'propinsi',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Propinsi', id: 'LIST'}]
            }),
            updatePropinsi: builder.mutation<void, Partial<IPropinsi>>({
                query: (body) => ({
                    url: 'propinsi',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Propinsi', id: id!}]
            }),
            updateIdPropinsi: builder.mutation<IPropinsi, {idLama: string; propinsi: IPropinsi}>({
                query: ({idLama, propinsi}) => ({
                    url: `propinsi/id/${idLama}`,
                    method: 'PUT',
                    body: propinsi,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Propinsi', id: idLama as string}]
            }),
            deletePropinsi: builder.mutation<Partial<IPropinsi>, Partial<IPropinsi>>({
                query: (propinsi) => ({                  
                    url: `propinsi/${propinsi.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Propinsi', id: id!}]
            }),
            getDaftarDataPropinsi: builder.query<IPropinsi[], IQueryParamFilters>({
                query: (queryParams) => `propinsi?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({type: 'Propinsi' as const, id: id!})
                        ),
                        { type: 'Propinsi', id: 'LIST' },
                    ]:
                    [{type: 'Propinsi', id: 'LIST'}],
            }),
            getJumlahDataPropinsi: builder.query<number, qFilters>({
                query: (queryFilters) => `propinsi/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKabupaten: builder.mutation<IKabupaten, Partial<IKabupaten>>({
                query: (body) => ({
                    url: 'kabupaten',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kabupaten', id: 'LIST'}]
            }),
            updateKabupaten: builder.mutation<void, Partial<IKabupaten>>({
                query: (body) => ({
                    url: 'kabupaten',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Kabupaten', id: id!}]
            }),
            updateIdKabupaten: builder.mutation<IKabupaten, {idLama: string; kabupaten: IKabupaten}>({
                query: ({idLama, kabupaten}) => ({
                    url: `Kabupaten/id/${idLama}`,
                    method: 'PUT',
                    body: kabupaten,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Kabupaten', id: idLama as string}]
            }),
            deleteKabupaten: builder.mutation<Partial<IKabupaten>, Partial<IKabupaten>>({
                query: (Kabupaten) => ({                  
                    url: `kabupaten/${Kabupaten.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Kabupaten', id: id!}]
            }),
            getDaftarDataKabupaten: builder.query<IKabupaten[], IQueryParamFilters>({
                query: (queryParams) => `kabupaten?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({type: 'Kabupaten' as const, id: id!})
                        ),
                        { type: 'Kabupaten', id: 'LIST' },
                    ]:
                    [{type: 'Kabupaten', id: 'LIST'}],
            }),
            getJumlahDataKabupaten: builder.query<number, qFilters>({
                query: (queryFilters) => `kabupaten/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveKecamatan: builder.mutation<IKecamatan, Partial<IKecamatan>>({
                query: (body) => ({
                    url: 'kecamatan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kecamatan', id: 'LIST'}]
            }),
            updateKecamatan: builder.mutation<void, Partial<IKecamatan>>({
                query: (body) => ({
                    url: 'kecamatan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Kecamatan', id: id!}]
            }),
            updateIdKecamatan: builder.mutation<IKecamatan, {idLama: string; kecamatan: IKecamatan}>({
                query: ({idLama, kecamatan}) => ({
                    url: `kecamatan/id/${idLama}`,
                    method: 'PUT',
                    body: kecamatan,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Kecamatan', id: idLama as string}]
            }),
            deleteKecamatan: builder.mutation<Partial<IKecamatan>, Partial<IKecamatan>>({
                query: (Kecamatan) => ({                  
                    url: `kecamatan/${Kecamatan.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Kecamatan', id: id!}]
            }),
            getDaftarDataKecamatan: builder.query<IKecamatan[], IQueryParamFilters>({
                query: (queryParams) => `kecamatan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({type: 'Kecamatan' as const, id: id!})
                        ),
                        { type: 'Kecamatan', id: 'LIST' },
                    ]:
                    [{type: 'Kecamatan', id: 'LIST'}],
            }),
            getJumlahDataKecamatan: builder.query<number, qFilters>({
                query: (queryFilters) => `kecamatan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            saveDesa: builder.mutation<IDesa, Partial<IDesa>>({
                query: (body) => ({
                    url: 'desa',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Desa', id: 'LIST'}]
            }),
            updateDesa: builder.mutation<void, Partial<IDesa>>({
                query: (body) => ({
                    url: 'desa',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Desa', id: id!}]
            }),
            updateIdDesa: builder.mutation<IDesa, {idLama: string; desa: IDesa}>({
                query: ({idLama, desa}) => ({
                    url: `desa/id/${idLama}`,
                    method: 'PUT',
                    body: desa,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Desa', id: idLama as string}]
            }),
            deleteDesa: builder.mutation<Partial<IDesa>, Partial<IDesa>>({
                query: (desa) => ({                  
                    url: `desa/${desa.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Desa', id: id!}]
            }),
            getDaftarDataDesa: builder.query<IDesa[], IQueryParamFilters>({
                query: (queryParams) => `desa?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({id}) => ({type: 'Desa' as const, id: id!})
                        ),
                        { type: 'Desa', id: 'LIST' },
                    ]:
                    [{type: 'Desa', id: 'LIST'}],
            }),
            getJumlahDataDesa: builder.query<number, qFilters>({
                query: (queryFilters) => `desa/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'POST',
                    // headers: {'Content-Type': 'multipart/form-data;boundary=???'},
                    body: dataForm,
                }),
                invalidatesTags: [{type: 'Person', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useSaveJenisKelaminMutation, useUpdateJenisKelaminMutation, useUpdateIdJenisKelaminMutation,
    useDeleteJenisKelaminMutation,useGetDaftarDataJenisKelaminQuery, useGetJumlahDataJenisKelaminQuery,
    useSavePropinsiMutation, useUpdatePropinsiMutation, useUpdateIdPropinsiMutation,
    useDeletePropinsiMutation,useGetDaftarDataPropinsiQuery, useGetJumlahDataPropinsiQuery,
    useSaveKabupatenMutation, useUpdateKabupatenMutation, useUpdateIdKabupatenMutation,
    useDeleteKabupatenMutation,useGetDaftarDataKabupatenQuery, useGetJumlahDataKabupatenQuery,
    useSaveKecamatanMutation, useUpdateKecamatanMutation, useUpdateIdKecamatanMutation,
    useDeleteKecamatanMutation,useGetDaftarDataKecamatanQuery, useGetJumlahDataKecamatanQuery,
    useSaveDesaMutation, useUpdateDesaMutation, useUpdateIdDesaMutation,
    useDeleteDesaMutation,useGetDaftarDataDesaQuery, useGetJumlahDataDesaQuery,
    useSavePersonMutation,
} = sikolingApi;