import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IJenisKelamin } from "../../entity/jenis-kelamin";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

export const JenisKelaminApiSlice = createApi({
    reducerPath: 'jenisKelaminApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Sex'],
    endpoints(builder) {
        return {
            save: builder.mutation<IJenisKelamin, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Sex', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IJenisKelamin>>({
                query: (body) => ({
                    url: 'sex',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Sex', id: id!}]
            }),
            updateId: builder.mutation<IJenisKelamin, {idLama: String; sex: IJenisKelamin}>({
                query: ({idLama, sex}) => ({
                    url: `sex/id/${idLama}`,
                    method: 'PUT',
                    body: sex,
                }),
                invalidatesTags: (result, error, { sex }) => {
                    return [{type: 'Sex', id: sex.id!}];
                }
            }),
            delete: builder.mutation<Partial<IJenisKelamin>, Partial<IJenisKelamin>>({
                query: (sex) => ({                  
                    url: `sex/${sex.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Sex', id: id!}]
            }),
            getDaftarData: builder.query<IJenisKelamin[], IQueryParamFilters>({
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
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `sex/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useSaveMutation, useUpdateMutation, useUpdateIdMutation,
    useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery
 } = JenisKelaminApiSlice