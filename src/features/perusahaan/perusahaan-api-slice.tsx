import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";
import { IPerusahaan } from "./perusahaan-slice";

type PerusahaanResponse = IPerusahaan[];

export const PerusahaanApiSlice = createApi({
    reducerPath: 'perusahaanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['Perusahaan'],
    endpoints(builder) {
        return {
            addPerusahaan: builder.mutation({
                query: (body) => ({
                    url: 'perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Perusahaan', id: 'LIST'}],
            }),
            updatePerusahaan: builder.mutation({
                query: (body) => ({
                    url: 'perusahaan',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: [{type: 'Perusahaan', id: 'LIST'}],
            }),
            getAllPerusahaan: builder.query<PerusahaanResponse, void>({
                query: () => `perusahaan`,
                // transformResponse: (response: {data: PerusahaanResponse}, meta, args) => {
                //     console.log(response);
                //     return response.data;
                // },
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Perusahaan' as const, id })
                        ),
                        { type: 'Perusahaan', id: 'LIST' },
                    ]:
                    [{type: 'Perusahaan', id: 'LIST'}],
            }),
            getPerusahaanByPage: builder.query<PerusahaanResponse, IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `perusahaan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanByNama: builder.query<PerusahaanResponse, string|void>({
                query: (nama) => `perusahaan/nama?nama=${nama}`,
            }),
            getPerusahaanByNamaAndPage: builder.query<PerusahaanResponse, IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `perusahaan/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
            getPerusahaanById: builder.query<PerusahaanResponse, string|void>({
                query: (idPerusahaan) => `perusahaan/kabupaten?idKabupaten=${idPerusahaan}`,
            }),
            isEksisPeusahaan: builder.query<boolean, string|void>({
                query: (idPerusahaan) => `perusahaan/is_eksis?id=${idPerusahaan}`,
            }),
        }
    }
});

export const { 
    useAddPerusahaanMutation, useUpdatePerusahaanMutation,
    useGetAllPerusahaanQuery, useGetPerusahaanByPageQuery, useGetPerusahaanByNamaAndPageQuery, 
    useLazyGetPerusahaanByNamaAndPageQuery, useGetPerusahaanByIdQuery, useIsEksisPeusahaanQuery
} = PerusahaanApiSlice;