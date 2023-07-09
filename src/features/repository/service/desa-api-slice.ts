import { createApi } from "@reduxjs/toolkit/query/react";
import { IDesa } from "../../entity/desa";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { DecreaseIndentArrowIcon } from "@fluentui/react-icons-mdl2";
import { deflateSync } from "zlib";

type daftarDesa = IDesa[];

export const DesaApiSlice = createApi({
    reducerPath: 'desaApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Desa'],
    endpoints(builder) {
        return {
            save: builder.mutation<IDesa, Partial<IDesa>>({
                query: (body) => ({
                    url: 'desa',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Desa', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IDesa>>({
                query: (body) => ({
                    url: 'desa',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Desa', id: id!}]
            }),
            updateId: builder.mutation<IDesa, {idLama: string; desa: IDesa}>({
                query: ({idLama, desa}) => ({
                    url: `desa/id/${idLama}`,
                    method: 'PUT',
                    body: desa,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Desa', id: idLama as string}]
            }),
            delete: builder.mutation<Partial<IDesa>, Partial<IDesa>>({
                query: (desa) => ({                  
                    url: `desa/${desa.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Desa', id: id!}]
            }),
            getDaftarData: builder.query<daftarDesa, IQueryParamFilters>({
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
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `desa/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useSaveMutation, useUpdateMutation, useUpdateIdMutation,
    useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery
 } = DesaApiSlice