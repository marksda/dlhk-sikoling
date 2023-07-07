import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IModelPerizinan } from "../../entity/model-perizinan";
import { IQueryParamFilters, qFilters } from "../../entity/query-param-filters";


type daftarModelPerizinan = IModelPerizinan[];

export const ModelPerizinanApiSlice = createApi({
    reducerPath: 'modelPerizinanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['ModelPerizinan'],
    endpoints(builder) {
        return {
            addModelPerizinan: builder.mutation<IModelPerizinan, Partial<IModelPerizinan>>({
                query: (body) => ({
                    url: 'model_perizinan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'ModelPerizinan', id: 'LIST'}]
            }),
            updateModelPerizinan: builder.mutation<void, Partial<IModelPerizinan>>({
                query: (modelPerizinan) => ({
                    url: 'model_perizinan',
                    method: 'PUT',
                    body: modelPerizinan,
                }),
                invalidatesTags: (result, error, { id }) => {
                    return [{type: 'ModelPerizinan', id: id!}]
                },
            }),
            deleteModelPerizinan: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `model_perizinan/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) =>{
                    return [{ type: 'ModelPerizinan', id }]
                },
            }),
            getAllModelPerizinan: builder.query<daftarModelPerizinan, IQueryParamFilters>({
                query: (queryParams) => `model_perizinan?filters=${JSON.stringify(queryParams)}`,
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
            getTotalCountModelPerizinan: builder.query<number, qFilters>({
                query: (queryFilters) => `model_perizinan/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        }
    }
});

export const {
    useAddModelPerizinanMutation, useUpdateModelPerizinanMutation,
    useDeleteModelPerizinanMutation, useGetAllModelPerizinanQuery, 
    useLazyGetAllModelPerizinanQuery, useGetTotalCountModelPerizinanQuery,
} = ModelPerizinanApiSlice;