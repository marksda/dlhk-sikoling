import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IHalamanBasePageAndPageSize, IHalamanBasePageAndPageSizeAndNama } from "../halaman/pagging";

export interface IModelPerizinan {
    id: string;
    nama: string;
    singkatan: string;
};

export const ModelPerizinanApiSlice = createApi({
    reducerPath: 'modelPerizinanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            addModelPerizinan: builder.mutation({
                query: (body) => ({
                    url: 'model_perizinan',
                    method: 'POST',
                    body,
                })
            }),
            updateModelPerizinan: builder.mutation({
                query: (body) => ({
                    url: 'model_perizinan',
                    method: 'PUT',
                    body,
                })
            }),
            getAllModelPerizinan: builder.query<IModelPerizinan[], void>({
                query: () => `model_perizinan`,
            }),
            getModelPerizinanByPage: builder.query<IModelPerizinan[], IHalamanBasePageAndPageSize>({
                query: ({page, pageSize}) => `model_perizinan/page?page=${page}&pageSize=${pageSize}`,
            }),
            getModelPerizinanByNama: builder.query<IModelPerizinan[], string|void>({
                query: (nama) => `model_perizinan/nama?nama=${nama}`,
            }),
            getModelPerizinanByNamaAndPage: builder.query<IModelPerizinan[], IHalamanBasePageAndPageSizeAndNama>({
                query: ({nama, page=1, pageSize=10}) => `pemrakarsa/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
            }),
        }
    }
});

export const {
    useAddModelPerizinanMutation, useUpdateModelPerizinanMutation,
    useGetAllModelPerizinanQuery, useGetModelPerizinanByPageQuery,
    useGetModelPerizinanByNamaQuery, useGetModelPerizinanByNamaAndPageQuery
} = ModelPerizinanApiSlice;