import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPelakuUsaha } from "./pelaku-usaha-slice";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

type daftarPelakuUsaha = IPelakuUsaha[];

export const PelakuUsahaApiSlice = createApi({
    reducerPath: 'pelakuUsahaApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['PelakuUsaha'],
    endpoints(builder) {
        return {
            addPelakuUsaha: builder.mutation<IPelakuUsaha, Partial<IPelakuUsaha>>({
                query: (body) => ({
                    url: 'pelaku_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'PelakuUsaha', id: 'LIST'}],
            }),
            updatePelakuUsaha: builder.mutation<void, {id: string, pelakuUsaha: IPelakuUsaha}>({
                query: ({id, pelakuUsaha}) => ({
                    url: `pelaku_usaha/${id}`,
                    method: 'PUT',
                    body: pelakuUsaha,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'PelakuUsaha', id: id}],
            }),
            deletePelakuUsaha: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `pelaku_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'PelakuUsaha', id }]
            }),
            getDaftarPelakuUsahaByFilters: builder.query<daftarPelakuUsaha, IQueryParams>({
                query: (queryParams) => `pelaku_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PelakuUsaha' as const, id: id! })
                        ),
                        { type: 'PelakuUsaha', id: 'LIST' },
                    ]:
                    [{type: 'PelakuUsaha', id: 'LIST'}],
            }),
            getTotalCountPelakuUsaha: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `pelaku_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { 
    useAddPelakuUsahaMutation, useUpdatePelakuUsahaMutation,
    useDeletePelakuUsahaMutation, useGetDaftarPelakuUsahaByFiltersQuery,
    useGetTotalCountPelakuUsahaQuery
} = PelakuUsahaApiSlice;