import { createApi } from "@reduxjs/toolkit/query/react";
import { IKecamatan } from "../../entity/kecamatan";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarKecamatan = IKecamatan[];

export const KecamatanApiSlice = createApi({
    reducerPath: 'kecamatanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Kecamatan'],
    endpoints(builder) {
        return {
            save: builder.mutation<IKecamatan, Partial<IKecamatan>>({
                query: (body) => ({
                    url: 'kecamatan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kecamatan', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IKecamatan>>({
                query: (body) => ({
                    url: 'kecamatan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {id}) => [{type: 'Kecamatan', id: id!}]
            }),
            updateId: builder.mutation<IKecamatan, {idLama: string; kecamatan: IKecamatan}>({
                query: ({idLama, kecamatan}) => ({
                    url: `kecamatan/id/${idLama}`,
                    method: 'PUT',
                    body: kecamatan,
                }),
                invalidatesTags: (result, error, {idLama}) => [{type: 'Kecamatan', id: idLama as string}]
            }),
            delete: builder.mutation<Partial<IKecamatan>, Partial<IKecamatan>>({
                query: (Kecamatan) => ({                  
                    url: `kecamatan/${Kecamatan.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Kecamatan', id: id!}]
            }),
            getDaftarData: builder.query<daftarKecamatan, IQueryParamFilters>({
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
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `kecamatan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useSaveMutation, useUpdateMutation, useUpdateIdMutation,
    useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery
 } = KecamatanApiSlice;