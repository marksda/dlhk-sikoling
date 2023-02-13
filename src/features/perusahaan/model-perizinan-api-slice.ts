import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";

export interface IModelPerizinan {
    id: string|null;
    nama: string|null;
    singkatan: string|null;
};

type daftarModelPerizinan = IModelPerizinan[];

export const ModelPerizinanApiSlice = createApi({
    reducerPath: 'modelPerizinanApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['ModelPerizinan', 'ModelPerizinanPage', 'ModelPerizinanNama', 'ModelPerizinanNamaPage'],
    endpoints(builder) {
        return {
            addModelPerizinan: builder.mutation<IModelPerizinan, Partial<IModelPerizinan>>({
                query: (body) => ({
                    url: 'model_perizinan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'ModelPerizinan', id: 'LIST'}, {type: 'ModelPerizinanPage', id: 'LIST'}, {type: 'ModelPerizinanNama', id: 'LIST'}, {type: 'ModelPerizinanNamaPage', id: 'LIST'}]
            }),
            updateModelPerizinan: builder.mutation<void, {id: string, modelPerizinan: IModelPerizinan}>({
                query: ({id, modelPerizinan}) => ({
                    url: 'model_perizinan',
                    method: 'PUT',
                    body: modelPerizinan,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'ModelPerizinan', id}, {type: 'ModelPerizinanPage', id}, {type: 'ModelPerizinanNama', id}, {type: 'ModelPerizinanNamaPage', id}]
            }),
            deleteModelPerizinan: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'ModelPerizinan', id }, { type: 'ModelPerizinanPage', id }, { type: 'ModelPerizinanNama', id }, { type: 'ModelPerizinanNamaPage', id }],
            }),
            getAllModelPerizinan: builder.query<daftarModelPerizinan, void>({
                query: () => `model_perizinan`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'ModelPerizinan' as const, id: id! })
                        ),
                        { type: 'ModelPerizinan', id: 'LIST' },
                    ]:
                    [{type: 'ModelPerizinan', id: 'LIST'}],
            }),
            getModelPerizinanByPage: builder.query<daftarModelPerizinan, {page: number; pageSize: number}>({
                query: ({page, pageSize}) => `model_perizinan/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'ModelPerizinanPage' as const, id: id! })
                        ),
                        { type: 'ModelPerizinanPage', id: 'LIST' },
                    ]:
                    [{type: 'ModelPerizinanPage', id: 'LIST'}],
            }),
            getModelPerizinanByNama: builder.query<daftarModelPerizinan, string>({
                query: (nama) => `model_perizinan/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'ModelPerizinanNama' as const, id: id! })
                        ),
                        { type: 'ModelPerizinanNama', id: 'LIST' },
                    ]:
                    [{type: 'ModelPerizinanNama', id: 'LIST'}],
            }),
            getModelPerizinanByNamaAndPage: builder.query<daftarModelPerizinan, {nama: string; page: number; pageSize: number}>({
                query: ({nama, page=1, pageSize=10}) => `pemrakarsa/nama?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'ModelPerizinanNamaPage' as const, id: id! })
                        ),
                        { type: 'ModelPerizinanNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'ModelPerizinanNamaPage', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddModelPerizinanMutation, useUpdateModelPerizinanMutation,
    useDeleteModelPerizinanMutation, useGetAllModelPerizinanQuery, 
    useGetModelPerizinanByPageQuery, useGetModelPerizinanByNamaQuery, 
    useGetModelPerizinanByNamaAndPageQuery
} = ModelPerizinanApiSlice;