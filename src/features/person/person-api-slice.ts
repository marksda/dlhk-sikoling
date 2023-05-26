import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerson } from "./person-slice";
import { IQueryParams } from "../config/query-params-slice";

type daftarPerson = IPerson[];

export const PersonApiSlice = createApi({
    reducerPath: 'personApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['Person'],
    endpoints(builder) {
        return {            
            addPerson: builder.mutation<IPerson, Partial<IPerson>>({
                query: (body) => ({
                    url: 'person',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Person', id: 'LIST'}],
            }),
            updatePerson: builder.mutation<void, Partial<IPerson>>({
                query: (person) => ({
                    url: 'person',
                    method: 'PUT',
                    body: person,
                }),
                invalidatesTags: (result, error, {nik}) => {
                    return [{type: 'Person', id: nik!}];
                },
            }),
            deletePerson: builder.mutation<{ success: boolean; id: string }, string>({
                query(nik) {
                  return {
                    url: `person/${nik}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, nik) => {
                    return [{type: 'Person', id: nik}]
                },
            }),
            getAllPerson: builder.query<daftarPerson, IQueryParams>({
                query: (queryParams) => `person?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ nik }) => ({ type: 'Person' as const, id: nik! })
                        ),
                        { type: 'Person', id: 'LIST' },
                    ]:
                    [{type: 'Person', id: 'LIST'}],
            }),
            getTotalCountPerson: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `person/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useAddPersonMutation, useUpdatePersonMutation,
    useDeletePersonMutation, useGetAllPersonQuery,
    useGetTotalCountPersonQuery
} = PersonApiSlice;