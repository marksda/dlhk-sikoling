import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IQueryParams } from "../config/query-params-slice";

export interface IHakAkses {
    id: string|null;
    nama: string|null;
    keterangan: string|null;
};

type daftarHakAkses = IHakAkses[];

export const HakAksesApiSlice = createApi({
    reducerPath: 'hakAksesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['HakAkses'],
    endpoints(builder) {
        return {
            addHakAkses: builder.mutation<IHakAkses, Partial<IHakAkses>>({
                query: (body) => ({
                    url: 'hak_akses',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'HakAkses', id: 'LIST'}],
            }),
            updateHakAkses: builder.mutation<void, Partial<IHakAkses>>({
                query: (hakAkses) => ({
                    url: 'hak_akses',
                    method: 'PUT',
                    body: hakAkses,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'HakAkses', id: id!}];
                },
            }),
            deleteHakAkses: builder.mutation<{ success: boolean; id: string }, string>({
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
            getDaftarHakAkses: builder.query<daftarHakAkses, IQueryParams>({
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
            getTotalCountHakAkses: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `hak_akses/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    }
});

export const { 
    useAddHakAksesMutation, useUpdateHakAksesMutation,
    useGetDaftarHakAksesQuery, useGetTotalCountHakAksesQuery
} = HakAksesApiSlice;