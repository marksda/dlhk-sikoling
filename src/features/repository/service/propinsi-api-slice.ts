import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl, defaultHalaman as halaman } from "../../config/config";
import { IPropinsi } from "../../entity/propinsi";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarPropinsi = IPropinsi[];

export const PropinsiApiSlice = createApi({
    reducerPath: 'propinsiApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Propinsi'],
    endpoints(builder) {
        return {
            save: builder.mutation<IPropinsi, Partial<IPropinsi>>({
                query: (body) => ({
                    url: 'propinsi',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Propinsi', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IPropinsi>>({
                query: (body) => ({
                    url: 'propinsi',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Propinsi', id: id!}]
            }),
            updateId: builder.mutation<IPropinsi, {idLama: string; propinsi: IPropinsi}>({
                query: ({idLama, propinsi}) => ({
                    url: `propinsi/id/${idLama}`,
                    method: 'PUT',
                    body: propinsi,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Propinsi', id: idLama as string}]
            }),
            delete: builder.mutation<Partial<IPropinsi>, Partial<IPropinsi>>({
                query: (propinsi) => ({                  
                    url: `propinsi/${propinsi.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Propinsi', id: id!}]
            }),
            getDaftarData: builder.query<daftarPropinsi, IQueryParamFilters>({
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
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `propinsi/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { 
    useSaveMutation, useUpdateMutation, useUpdateIdMutation,
    useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery
 } = PropinsiApiSlice;