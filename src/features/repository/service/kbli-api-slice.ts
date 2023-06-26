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
            addKbli: builder.mutation<IKbli, Partial<IKbli>>({
                query: (body) => ({
                    url: 'kbli',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Kbli', id: 'LIST'}]
            }),
            updateKbliById: builder.mutation<void, {kode: string; kbli: IKbli}>({
                query: ({kode, kbli}) => ({
                    url: `kbli/id/${kode}`,
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result, error, { kode }) => [{type: 'Kbli', id: kode}]
            }),
            updateKbli: builder.mutation<void, Partial<IKbli>>({
                query: (kbli) => ({
                    url: 'kbli',
                    method: 'PUT',
                    body: kbli,
                }),
                invalidatesTags: (result, error, { kode }) => {
                    return [{type: 'Kbli', id: kode}];
                }
            }),
            deleteKbli: builder.mutation<{ success: boolean; kode: string }, string>({
                query(kode) {
                  return {
                    url: `kbli/${kode}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, kode) => [{type: 'Kbli', id: kode}]
            }),
            getDaftarKbliByFilter: builder.query<daftarKbli, IQueryParamFilters>({
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
            getTotalCountKbli: builder.query<number, qFilters>({
                query: (queryFilters) => `kbli/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddKbliMutation, useUpdateKbliByIdMutation, 
    useDeleteKbliMutation, useGetDaftarKbliByFilterQuery,
    useUpdateKbliMutation, useGetTotalCountKbliQuery
} = KbliApiSlice;