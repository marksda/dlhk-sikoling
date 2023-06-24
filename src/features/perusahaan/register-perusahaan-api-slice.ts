import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPerson } from "../repository/ssot/person-slice";
import { IPerusahaan } from "./perusahaan-slice";
import { IRegisterPerusahaan } from "./register-perusahaan-slice";
import { IQueryParams } from "../config/query-params-slice";

type daftarRegisterPerusahaan = IRegisterPerusahaan[];

export const RegisterPerusahaanApiSlice = createApi({
    reducerPath: 'registerPerusahaanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['RegisterPerusahaan', 'RegisterPerusahaanPage', 'RegisterPerusahaanNama', 'RegisterPerusahaanNamaPage', 'RegisterPerusahaanNpwp', 'RegisterPerusahaanByIdPerson', 'RegisterPerusahaanByIdLinkKepemilikan', 'RegisterPerusahaanTanpaDokumenByIdLinkKepemilikan'],
    endpoints(builder) {
        return {
            addRegisterPerusahaan: builder.mutation<IRegisterPerusahaan, Partial<IPerusahaan>>({
                query: (body) => ({
                    url: 'register_perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}, {type: 'RegisterPerusahaanPage', id: 'LIST'}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST'}],
            }),            
            addLinkKepemilikanPerusahaan: builder.mutation<IRegisterPerusahaan, { perusahaan: Partial<IPerusahaan>, pemilik: Partial<IPerson>}>({
                query: (item) => ({
                    url: 'register_perusahaan/add_kepemilikan',
                    method: 'POST',
                    body: item,
                }),
                invalidatesTags: [{type: 'RegisterPerusahaan', id: 'LIST'}, {type: 'RegisterPerusahaanPage', id: 'LIST'}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}],
            }),
            updateRegisterPerusahaan: builder.mutation<void, Partial<IPerusahaan>>({
                query: (perusahaan) => ({
                    url: 'register_perusahaan',
                    method: 'PUT',
                    body: perusahaan,
                }),
                invalidatesTags: (result, error, perusahaan) => {
                    let id = perusahaan?.id as string;
                    return [{type: 'RegisterPerusahaan', id}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: 'LIST'}, {type: 'RegisterPerusahaanNamaPage', id: 'LIST'}, {type: 'RegisterPerusahaanNpwp', id: 'LIST'}, {type: 'RegisterPerusahaanByIdPerson', id: 'LIST'}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: 'LIST'}];
                },
            }),
            deleteRegisterPerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idPerusahaan) {
                  return {
                    url: `register_perusahaan/${idPerusahaan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idPerusahaan) => {
                    let id = result?.id;
                    return [{type: 'RegisterPerusahaan', id: id}, {type: 'RegisterPerusahaanPage', id}, {type: 'RegisterPerusahaanNama', id: id}, {type: 'RegisterPerusahaanNamaPage', id: id}, {type: 'RegisterPerusahaanNpwp', id: id}, {type: 'RegisterPerusahaanByIdPerson', id: id}, {type: 'RegisterPerusahaanByIdLinkKepemilikan', id: id}]
                },
            }),
            deleteLinkKepemilikanRegisterPerusahaan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idRegisterPerusahaan) {
                  return {
                    url: `register_perusahaan/kepemilikan/${idRegisterPerusahaan}`,
                    method: 'DELETE'
                  }
                },
                invalidatesTags: (result, error, id) => {
                    // let id = result?.id;
                    return [{type: 'RegisterPerusahaanByIdLinkKepemilikan', id: id}]},
            }),
            getAllRegisterPerusahaan: builder.query<daftarRegisterPerusahaan, IQueryParams>({
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
            getTotalCountRegisterPerusahaan: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `register_perusahaan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
            isEksisRegisterPerusahaan: builder.query<boolean, string|null>({
                query: (idRegisterPerusahaan) => `register_perusahaan/is_eksis?id=${idRegisterPerusahaan}`,
            }),
        }
    }
});

export const {
    useAddRegisterPerusahaanMutation, useUpdateRegisterPerusahaanMutation,
    useDeleteRegisterPerusahaanMutation, useGetAllRegisterPerusahaanQuery, 
    useIsEksisRegisterPerusahaanQuery, useDeleteLinkKepemilikanRegisterPerusahaanMutation,
    useGetTotalCountRegisterPerusahaanQuery,
} = RegisterPerusahaanApiSlice;