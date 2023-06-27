import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IOtoritas } from "../../entity/otoritas";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarOtoritas = IOtoritas[];

export const OtoritasApiSlice = createApi({
    reducerPath: 'otoritasApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Otoritas'],
    endpoints(builder) {
        return {
            save: builder.mutation<Partial<IOtoritas>, Partial<IOtoritas>>({
                query: (body) => ({
                    url: 'otoritas',
                    method: 'POST',
                    body
                }),
                invalidatesTags: [{type: 'Otoritas', id: 'LIST'}],
            }),  
            update: builder.mutation<void, Partial<IOtoritas>>({
                query: (body) => ({
                    url: 'otoritas',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'Otoritas', id: id!}];
                },
            }),
            updateId: builder.mutation<void, {idLama: string; otoritas: Partial<IOtoritas>}>({
                query: ({idLama, otoritas}) => ({
                    url: `otoritas/id/${idLama}`,
                    method: 'PUT',
                    body: otoritas,
                }),
                invalidatesTags: (result, error, { idLama }) => {
                    return [{type: 'Otoritas', id: idLama}];
                }
            }),
            delete: builder.mutation<IOtoritas, IOtoritas>({
                query(otoritas) {
                  return {
                    url: 'otoritas',
                    method: 'DELETE',
                    body: otoritas
                  }
                },
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'Otoritas', id: id!}]
                },
            }),
            getDaftarData: builder.query<daftarOtoritas, IQueryParamFilters>({
                query: (queryParams) => `otoritas?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Otoritas' as const, id: id as string })
                        ),
                        { type: 'Otoritas', id: 'LIST' },
                    ]:
                    [{type: 'Otoritas', id: 'LIST'}],
            }),
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `otoritas/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    },
});

export const { useSaveMutation, useUpdateMutation, useUpdateIdMutation, useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery } = OtoritasApiSlice;