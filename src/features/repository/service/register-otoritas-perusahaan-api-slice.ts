import { createApi } from "@reduxjs/toolkit/query/react";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IOtoritasPerusahaan } from "../../entity/otoritas-perusahaan";

type daftarOtoritasPerusahaan = IOtoritasPerusahaan[];

export const RegisterOtoritasPerusahaanApiSlice = createApi({
    reducerPath: 'registerOtoritasPerusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['RegisterOtoritasPerusahaan'],
    endpoints(builder) {
        return {
            save: builder.mutation<IOtoritasPerusahaan, Partial<IOtoritasPerusahaan>>({
                query: (body) => ({
                    url: 'otoritas_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterOtoritasPerusahaan', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IOtoritasPerusahaan>>({
                query: (body) => ({
                    url: 'otoritas_perusahaan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: (result, error, {otoritas, registerPerusahaan}) => [{type: 'RegisterOtoritasPerusahaan', id: `${otoritas?.id}-${registerPerusahaan?.id}`},]
            }),
            updateId: builder.mutation<IOtoritasPerusahaan, {idLamaAutority: String; idLamaRegisterPerusahaan: string; registerOtoritasPerusahaan: IOtoritasPerusahaan}>({
                query: ({idLamaAutority, idLamaRegisterPerusahaan, registerOtoritasPerusahaan}) => ({
                    url: `otoritas_perusahaan/id/${idLamaAutority}/${idLamaRegisterPerusahaan}`,
                    method: 'PUT',
                    body: registerOtoritasPerusahaan,
                }),
                invalidatesTags: (result, error, { idLamaAutority, idLamaRegisterPerusahaan }) => {
                    return [{type: 'RegisterOtoritasPerusahaan', id: `${idLamaAutority}-${idLamaRegisterPerusahaan}`}];
                }
            }),
            delete: builder.mutation<Partial<IOtoritasPerusahaan>, Partial<IOtoritasPerusahaan>>({
                query: (otoritasPerusahaan) => ({                  
                    url: `otoritas_perusahaan/${otoritasPerusahaan.otoritas?.id}/${otoritasPerusahaan.registerPerusahaan?.id}`,
                    method: 'DELETE',            
                }),
                invalidatesTags: (result, error, { otoritas, registerPerusahaan }) => [{type: 'RegisterOtoritasPerusahaan', id: `${otoritas?.id}-${registerPerusahaan?.id}`},]
            }),
            getDaftarData: builder.query<daftarOtoritasPerusahaan, IQueryParamFilters>({
                query: (queryParams) => `otoritas_perusahaan?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({otoritas, registerPerusahaan}) => ({ type: 'RegisterOtoritasPerusahaan' as const, id: `${otoritas?.id}-${registerPerusahaan?.id}`})
                        ),
                        { type: 'RegisterOtoritasPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterOtoritasPerusahaan', id: 'LIST'}],
            }),
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `otoritas_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { useSaveMutation, useUpdateMutation, useUpdateIdMutation, useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery } = RegisterOtoritasPerusahaanApiSlice;