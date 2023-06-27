import { createApi } from "@reduxjs/toolkit/query/react";
import { IRegisterKbli } from "../../entity/register-kbli";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";
import { baseQueryWithReauth } from "../../config/helper-function";

type daftarRegisterKbli = IRegisterKbli[];

export const RegisterKbliApiSlice = createApi({
    reducerPath: 'registerKbliApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['RegisterOtoritasPerusahaan'],
    endpoints(builder) {
        return {
            save: builder.mutation<IRegisterKbli, Partial<IRegisterKbli>>({
                query: (body) => ({
                    url: 'register_kbli',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterOtoritasPerusahaan', id: 'LIST'}]
            }),
            update: builder.mutation<void, Partial<IRegisterKbli>>({
                query: (registerKbli) => ({
                    url: 'register_kbli',
                    method: 'PUT',
                    body: registerKbli,
                }),
                invalidatesTags: (result, error, {dokumenNibOss, kbli}) => [{type: 'RegisterOtoritasPerusahaan', id: `${dokumenNibOss?.nomor}-${kbli?.kode}`},]
            }),
            updateId: builder.mutation<IRegisterKbli, {idNibLama: String; idKbliLama: string; registerKbli: IRegisterKbli}>({
                query: ({idNibLama, idKbliLama, registerKbli}) => ({
                    url: `register_kbli/${idNibLama}/${idKbliLama}`,
                    method: 'PUT',
                    body: registerKbli,
                }),
                invalidatesTags: (result, error, { idNibLama, idKbliLama }) => {
                    return [{type: 'RegisterOtoritasPerusahaan', id: `${idNibLama}-${idKbliLama}`}];
                }
            }),
            delete: builder.mutation<Partial<IRegisterKbli>, Partial<IRegisterKbli>>({
                query: (registerKbli) => ({                  
                    url: 'register_kbli',
                    method: 'DELETE',
                    body: registerKbli,                
                }),
                invalidatesTags: (result, error, { dokumenNibOss, kbli }) => [{type: 'RegisterOtoritasPerusahaan', id: `${dokumenNibOss?.nomor}-${kbli?.kode}`},]
            }),
            getDaftarData: builder.query<daftarRegisterKbli, IQueryParamFilters>({
                query: (queryParams) => `register_kbli?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({dokumenNibOss, kbli}) => ({ type: 'RegisterOtoritasPerusahaan' as const, id: `${dokumenNibOss?.nomor}-${kbli?.kode}`})
                        ),
                        { type: 'RegisterOtoritasPerusahaan', id: 'LIST' },
                    ]:
                    [{type: 'RegisterOtoritasPerusahaan', id: 'LIST'}],
            }),
            getJumlahData: builder.query<number, qFilters>({
                query: (queryFilters) => `register_kbli/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const { useSaveMutation, useUpdateMutation, useUpdateIdMutation, useDeleteMutation, useGetDaftarDataQuery, useGetJumlahDataQuery } = RegisterKbliApiSlice;