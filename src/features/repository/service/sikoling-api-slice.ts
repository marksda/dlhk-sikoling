import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";
import { IPropinsi } from "../../entity/propinsi";
import { IKabupaten } from "../../entity/kabupaten";
import { IKecamatan } from "../../entity/kecamatan";
import { IDesa } from "../../entity/desa";
import { IJenisKelamin } from "../../entity/jenis-kelamin";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Desa', 'Kabupaten', 'Kecamatan', 'Kosong', 'Person', 'Propinsi', 'Sex'],
    endpoints: builder => {
        return {
            saveJenisKelamin: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            updateJenisKelamin: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            updateIdJenisKelamin: builder.mutation<IJenisKelamin, {idLama: String; sex: IJenisKelamin}>({
                query: ({idLama, sex}) => ({
                    url: `sex/id/${idLama}`,
                    method: 'PUT',
                    body: sex,
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            deleteJenisKelamin: builder.mutation<Partial<IJenisKelamin>, Partial<IJenisKelamin>>({
                query: (sex) => ({                  
                    url: `sex/${sex.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Sex']:['Kosong']
            }),
            getDaftarDataJenisKelamin: builder.query<IJenisKelamin[], IQueryParamFilters>({
                query: (queryParams) => `sex?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Sex']
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
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            updatePropinsi: builder.mutation<void, Partial<IPropinsi>>({
                query: (body) => ({
                    url: 'propinsi',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            updateIdPropinsi: builder.mutation<IPropinsi, {idLama: string; propinsi: IPropinsi}>({
                query: ({idLama, propinsi}) => ({
                    url: `propinsi/id/${idLama}`,
                    method: 'PUT',
                    body: propinsi,
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            deletePropinsi: builder.mutation<Partial<IPropinsi>, Partial<IPropinsi>>({
                query: (propinsi) => ({                  
                    url: `propinsi/${propinsi.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Propinsi']:['Kosong']
            }),
            getDaftarDataPropinsi: builder.query<IPropinsi[], IQueryParamFilters>({
                query: (queryParams) => `propinsi?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Propinsi']
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
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
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
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            deleteKabupaten: builder.mutation<Partial<IKabupaten>, Partial<IKabupaten>>({
                query: (Kabupaten) => ({                  
                    url: `kabupaten/${Kabupaten.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Kabupaten']:['Kosong']
            }),
            getDaftarDataKabupaten: builder.query<IKabupaten[], IQueryParamFilters>({
                query: (queryParams) => `kabupaten?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Kabupaten'],
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
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            updateKecamatan: builder.mutation<void, Partial<IKecamatan>>({
                query: (body) => ({
                    url: 'kecamatan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            updateIdKecamatan: builder.mutation<IKecamatan, {idLama: string; kecamatan: IKecamatan}>({
                query: ({idLama, kecamatan}) => ({
                    url: `kecamatan/id/${idLama}`,
                    method: 'PUT',
                    body: kecamatan,
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            deleteKecamatan: builder.mutation<Partial<IKecamatan>, Partial<IKecamatan>>({
                query: (Kecamatan) => ({                  
                    url: `kecamatan/${Kecamatan.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Kecamatan']:['Kosong']
            }),
            getDaftarDataKecamatan: builder.query<IKecamatan[], IQueryParamFilters>({
                query: (queryParams) => `kecamatan?filters=${JSON.stringify(queryParams)}`,
                providesTags:['Kecamatan']
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
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            updateDesa: builder.mutation<void, Partial<IDesa>>({
                query: (body) => ({
                    url: 'desa',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            updateIdDesa: builder.mutation<IDesa, {idLama: string; desa: IDesa}>({
                query: ({idLama, desa}) => ({
                    url: `desa/id/${idLama}`,
                    method: 'PUT',
                    body: desa,
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            deleteDesa: builder.mutation<Partial<IDesa>, Partial<IDesa>>({
                query: (desa) => ({                  
                    url: `desa/${desa.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result) => result? ['Desa']:['Kosong']
            }),
            getDaftarDataDesa: builder.query<IDesa[], IQueryParamFilters>({
                query: (queryParams) => `desa?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Desa'],
            }),
            getJumlahDataDesa: builder.query<number, qFilters>({
                query: (queryFilters) => `desa/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            savePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'POST',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            updatePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'PUT',
                    body: dataForm,
                    
                }),
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            updateIdPerson: builder.mutation<IPerson, {idLama: string; dataForm: FormData}>({
                query: ({idLama, dataForm}) => ({
                    url: `person/id/${idLama}`,
                    method: 'PUT',
                    body: dataForm,
                }),
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            deletePerson: builder.mutation<Partial<IPerson>, Partial<IPerson>>({
                query(person) {
                  return {
                    url: `person/${person.nik}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result) => result? ['Person']:['Kosong']
            }),
            getDaftarDataPerson: builder.query<IPerson[], IQueryParamFilters>({
                query: (queryParams) => `person?filters=${JSON.stringify(queryParams)}`,
                providesTags: ['Person'],
            }),
            getJumlahDataPerson: builder.query<number, qFilters>({
                query: (queryFilters) => `person/count?filters=${JSON.stringify(queryFilters)}`,
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
    useSavePersonMutation, useUpdatePersonMutation, useUpdateIdPersonMutation,
    useDeletePersonMutation, useGetDaftarDataPersonQuery, useGetJumlahDataPersonQuery,
} = sikolingApi;