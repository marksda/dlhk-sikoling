import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IRegisterPerusahaan } from "../../entity/register-perusahaan";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { IPerusahaan } from "../../entity/perusahaan";

type daftarRegisterPerusahaan = IRegisterPerusahaan[];

export const RegisterPerusahaanApiSlice = createApi({
    reducerPath: 'registerPerusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['RegisterPerusahaan'],
    endpoints(builder) {
        return {
            save: builder.mutation<IRegisterPerusahaan, Partial<IPerusahaan>>({
                query: (body) => ({
                    url: 'register_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}],
            }), 
            update: builder.mutation<void, Partial<IPerusahaan>>({
                query: (perusahaan) => ({
                    url: 'register_perusahaan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, perusahaan) => {
                    let id = perusahaan?.id as string;
                    return [{type: 'RegisterPerusahaan', id}];
                },
            }),
            updateId: builder.mutation<void, {idLama: string; registerPerusahaan: IRegisterPerusahaan}>({
                query: ({idLama, registerPerusahaan}) => ({
                    url: `register_perusahaan/id/${idLama}`,
                    method: 'PUT',
                    body: registerPerusahaan,
                }),
                invalidatesTags: (result, error, { idLama }) => {
                    return [{type: 'RegisterPerusahaan', id: idLama}];
                }
            }),
            delete: builder.mutation<IRegisterPerusahaan, IRegisterPerusahaan>({
                query(registerPerusahaan) {
                  return {
                    url: 'register_perusahaan',
                    method: 'DELETE',
                    body: registerPerusahaan
                  }
                },
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'RegisterPerusahaan', id: id!}]
                },
            }),
            getDaftarData: builder.query<daftarRegisterPerusahaan, IQueryParamFilters>({
                query: (queryParams) => `register_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterPerusahaan' as const, id: id as string })
                        ),
                        { type: 'RegisterPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterPerusahaan', id: 'LIST'}],
            }),
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `register_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { useSaveMutation, useUpdateMutation, useUpdateIdMutation, useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery  } = RegisterPerusahaanApiSlice;