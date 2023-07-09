import { createApi } from "@reduxjs/toolkit/query/react";
import { IKabupaten } from "../../entity/kabupaten";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarKabupaten = IKabupaten[];
export const KabupatenApiSlice = createApi({
    reducerPath: 'kabupatenApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Kabupaten'],
    endpoints(builder) {
        return {
            save: builder.mutation<IKabupaten, Partial<IKabupaten>>({
                query: (body) => ({
                    url: 'kabupaten',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kabupaten', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IKabupaten>>({
                query: (body) => ({
                    url: 'kabupaten',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Kabupaten', id: id!}]
            }),
            updateId: builder.mutation<IKabupaten, {idLama: string; kabupaten: IKabupaten}>({
                query: ({idLama, kabupaten}) => ({
                    url: `Kabupaten/id/${idLama}`,
                    method: 'PUT',
                    body: kabupaten,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Kabupaten', id: idLama as string}]
            }),
            delete: builder.mutation<Partial<IKabupaten>, Partial<IKabupaten>>({
                query: (Kabupaten) => ({                  
                    url: `kabupaten/${Kabupaten.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Kabupaten', id: id!}]
            }),
            getDaftarData: builder.query<daftarKabupaten, IQueryParamFilters>({
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
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `kabupaten/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useSaveMutation, useUpdateMutation, useUpdateIdMutation,
    useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery
 } = KabupatenApiSlice