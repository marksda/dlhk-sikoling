import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IKbli } from "../../entity/kbli";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarKbli = IKbli[];

export const KbliApiSlice = createApi({
    reducerPath: 'kbliApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Kbli'],
    endpoints(builder) {
        return {
            save: builder.mutation<IKbli, Partial<IKbli>>({
                query: (body) => ({
                    url: 'kbli',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kbli', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IKbli>>({
                query: (kbli) => ({
                    url: 'kbli',
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result, error, { kode }) => {
                    return [{type: 'Kbli', id: kode}];
                }
            }),
            updateId: builder.mutation<void, {kode: string; kbli: IKbli}>({
                query: ({kode, kbli}) => ({
                    url: `kbli/id/${kode}`,
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result, error, { kode }) => [{type: 'Kbli', id: kode}]
            }),
            delete: builder.mutation<{ success: boolean; kode: string }, string>({
                query(kode) {
                  return {
                    url: `kbli/${kode}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, kode) => [{type: 'Kbli', id: kode}]
            }),
            getDaftarData: builder.query<daftarKbli, IQueryParamFilters>({
                query: (queryParams) => `kbli?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ kode }) => ({ type: 'Kbli' as const, id: kode })
                        ),
                        { type: 'Kbli', id: 'LIST' },
                    ]:
                    [{type: 'Kbli', id: 'LIST'}],
            }),
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `kbli/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { useSaveMutation, useUpdateMutation, useUpdateIdMutation, useDeleteMutation, useGetDaftarDataQuery,useGetJumlahDataQuery } = KbliApiSlice;