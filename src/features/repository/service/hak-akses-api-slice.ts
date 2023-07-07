import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IHakAkses } from "../../entity/hak-akses";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarHakAkses = IHakAkses[];

export const HakAksesApiSlice = createApi({
    reducerPath: 'hakAksesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['HakAkses'],
    endpoints(builder) {
        return {
            save: builder.mutation<IHakAkses, Partial<IHakAkses>>({
                query: (body) => ({
                    url: 'hak_akses',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'HakAkses', id: 'LIST'}],
            }),
            update: builder.mutation<void, Partial<IHakAkses>>({
                query: (hakAkses) => ({
                    url: 'hak_akses',
                    method: 'PUT',
                    body: hakAkses,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'HakAkses', id: id!}];
                },
            }),
            delete: builder.mutation<Partial<IHakAkses>, string>({
                query(idHakAkses) {
                  return {
                    url: `hak_akses/${idHakAkses}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idHakAkses) => {
                    return [{type: 'HakAkses', id: idHakAkses}]
                },
            }),
            getDaftarHakAkses: builder.query<daftarHakAkses, IQueryParamFilters>({
                query: (queryParams) => `hak_akses?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'HakAkses' as const, id: id as string })
                        ),
                        { type: 'HakAkses', id: 'LIST' },
                    ]:
                    [{type: 'HakAkses', id: 'LIST'}],
            }),
            getTotalCountHakAkses: builder.query<number, qFilters>({
                query: (queryFilters) => `hak_akses/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    }
});

export const { 
    useSaveMutation, useUpdateMutation, useDeleteMutation,
    useGetDaftarHakAksesQuery, useGetTotalCountHakAksesQuery
} = HakAksesApiSlice;