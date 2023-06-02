import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IDokumenNibOss } from "./dokumen-nib-oss-slice";
import { IDokumen } from "./dokumen-slice";
import { IQueryParams } from "../config/query-params-slice";

type daftarDokumen = IDokumen[];

export const DokumenApiSlice = createApi({
    reducerPath: 'dokumenApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Dokumen'],
    endpoints(builder) {
        return {            
            addDokumen: builder.mutation<IDokumen, Partial<IDokumen>|Partial<IDokumenNibOss>>({
                query: (body) => ({
                    url: 'dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Dokumen', id: 'LIST'}],
            }),
            updateDokumen: builder.mutation<void, {id: string; dokumen: IDokumen}>({
                query: ({id, dokumen}) => ({
                    url: `dokumen/${id}`,
                    method: 'PUT',
                    body: dokumen,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'Dokumen', id}],
            }),
            updateDokunentById: builder.mutation<void, {id: string; dokumen: IDokumen}>({
                query: ({id, dokumen}) => ({
                    url: `dokumen/id/${id}`,
                    method: 'PUT',
                    body: dokumen,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'Dokumen', id}];
                }
            }),
            deleteDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'Dokumen', id }],
            }),
            getDaftarDokumentByFilter: builder.query<daftarDokumen, IQueryParams>({
                query: (queryParams) => `dokumen?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Dokumen' as const, id: id! })
                        ),
                        { type: 'Dokumen', id: 'LIST' },
                    ]:
                    [{type: 'Dokumen', id: 'LIST'}],
            }),
            getTotalCountDokumen: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `dokumen/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    }
});

export const {
    useAddDokumenMutation, useUpdateDokumenMutation,
    useUpdateDokunentByIdMutation, useDeleteDokumenMutation,
    useGetDaftarDokumentByFilterQuery, useGetTotalCountDokumenQuery
} = DokumenApiSlice;