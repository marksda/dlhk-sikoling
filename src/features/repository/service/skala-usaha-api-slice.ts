import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { ISkalaUsaha } from "../../entity/skala-usaha";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarSkalaUsaha = ISkalaUsaha[];

export const SkalaUsahaApiSlice = createApi({
    reducerPath: 'skalaUsahaApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['SkalaUsaha'],
    endpoints(builder) {
        return {
            addSkalaUsaha: builder.mutation<ISkalaUsaha, Partial<ISkalaUsaha>>({
                query: (body) => ({
                    url: 'skala_usaha',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'SkalaUsaha', id: 'LIST'}],
            }),
            updateSkalaUsaha: builder.mutation<void, Partial<ISkalaUsaha>>({
                query: (skalaUsaha) => ({
                    url: 'skala_usaha',
                    method: 'PUT',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'SkalaUsaha', id: id!}];
                }
            }),
            updateSkalaUsahaById: builder.mutation<void, {id: string; skalaUsaha: ISkalaUsaha}>({
                query: ({id, skalaUsaha}) => ({
                    url: `skala_usaha/id/${id}`,
                    method: 'PUT',
                    body: skalaUsaha,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'SkalaUsaha', id}];
                }
            }),
            deleteSkalaUsaha: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `skala_usaha/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => {
                    return [{type: 'SkalaUsaha', id}];
                }
            }),
            getAllSkalaUsaha: builder.query<daftarSkalaUsaha, IQueryParamFilters>({
                query: (queryParams) => `skala_usaha?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'SkalaUsaha' as const, id: id! })
                        ),
                        { type: 'SkalaUsaha', id: 'LIST' },
                    ]:
                    [{type: 'SkalaUsaha', id: 'LIST'}],
            }),
            // getTotalCountSkalaUsaha: builder.query<number, Pick<IQueryParamFilters, "filters">>({
            getTotalCountSkalaUsaha: builder.query<number, qFilters>({
                query: (queryFilters) => `skala_usaha/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { 
    useAddSkalaUsahaMutation, useUpdateSkalaUsahaMutation,
    useUpdateSkalaUsahaByIdMutation, useDeleteSkalaUsahaMutation, 
    useGetAllSkalaUsahaQuery, useGetTotalCountSkalaUsahaQuery
} = SkalaUsahaApiSlice;