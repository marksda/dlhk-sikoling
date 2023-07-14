import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";

type daftarPerson = IPerson[];

export const PersonApiSlice = createApi({
    reducerPath: 'personApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['Person'],
    endpoints(builder) {
        return {            
            save: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'POST',
                    headers: {'Content-Type': 'multipart/form-data'},
                    body: dataForm,
                }),
                // queryFn: async (data, api, extraOptions, baseQuery) => {
                //     try {
                //         const result =  await axios.put('sdf', data, {

                //         });
                //         return { data: result.data }
                //     }
                //     catch (axiosError) {
                //         let err = axiosError;
                //         return {
                //             error: {
                //             status: err.response?.status,
                //             data: err.response?.data || err.message,
                //             },
                //         }
                //     }                   
                // },
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
            getAllPerson: builder.query<daftarPerson, IQueryParamFilters>({
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
            getTotalCountPerson: builder.query<number, qFilters>({
                query: (queryFilters) => `person/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
})

export const { 
    useSaveMutation, useUpdatePersonMutation,
    useDeletePersonMutation, useGetAllPersonQuery,
    useGetTotalCountPersonQuery
} = PersonApiSlice;