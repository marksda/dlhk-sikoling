import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";

export interface ISkalaUsaha {
    id: string|null;
    nama: string|null;
    singkatan: string|null;
};

export const SkalaUsahaApiSlice = createApi({
    reducerPath: 'skalaUsahaApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            addSkalaUsaha: builder.mutation({
                query: (body) => ({
                    url: 'skala_usaha',
                    method: 'POST',
                    body,
                })
            }),
            updateSkalaUsaha: builder.mutation({
                query: (body) => ({
                    url: 'skala_usaha',
                    method: 'PUT',
                    body,
                })
            }),
            getAllSkalaUsaha: builder.query<ISkalaUsaha[], void>({
                query: () => `skala_usaha`,
            }),
            getSkalaUsahaByPage: builder.query<ISkalaUsaha[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `skala_usaha/page?page=${page}&pageSize=${pageSize}`,
            }),
            getSkalaUsahaByNama: builder.query<ISkalaUsaha[], string|void>({
                query: (nama) => `skala_usaha/nama?nama=${nama}`,
            }),
            getSkalaUsahaByNamaAndPage: builder.query<ISkalaUsaha[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `skala_usaha/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            })
        }
    }
});

export const { 
    useAddSkalaUsahaMutation, useUpdateSkalaUsahaMutation,
    useGetAllSkalaUsahaQuery, useGetSkalaUsahaByPageQuery,
    useGetSkalaUsahaByNamaQuery, useGetSkalaUsahaByNamaAndPageQuery
} = SkalaUsahaApiSlice;