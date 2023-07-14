import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";
import { IPropinsi } from "../../entity/propinsi";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { IKabupaten } from "../../entity/kabupaten";

export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Kabupaten','Person', 'Propinsi'],
    endpoints: builder => {
        return {
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
    useSavePropinsiMutation, useUpdatePropinsiMutation, useUpdateIdPropinsiMutation,
    useDeletePropinsiMutation,useGetDaftarDataPropinsiQuery, useGetJumlahDataPropinsiQuery,
    useSaveKabupatenMutation, useUpdateKabupatenMutation, useUpdateIdKabupatenMutation,
    useDeleteKabupatenMutation,useGetDaftarDataKabupatenQuery, useGetJumlahDataKabupatenQuery,
    useSavePersonMutation,
} = sikolingApi;