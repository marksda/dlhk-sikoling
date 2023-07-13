import { createApi } from "@reduxjs/toolkit/dist/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/dist/query/react";
import { IPerson } from "../../entity/person";
import { sikolingBaseRestAPIUrl } from "../../config/config";
import { useAppSelector } from "../../../app/hooks";

const axiosBaseQuery = ({ baseURL }: { baseURL: string } = { baseURL: sikolingBaseRestAPIUrl }):BaseQueryFn<{
    url: string
    method: AxiosRequestConfig['method']
    headers: AxiosRequestConfig['headers']
    data?: AxiosRequestConfig['data']
    params?: AxiosRequestConfig['params']
  },
  unknown,
  unknown> => async ({ url, method, data, params }) => {
    const token = useAppSelector((state) => state.token);
    try {
        const result = await axios({ url, baseURL, method, headers, data, params });
        return { data: result.data }
      } catch (axiosError) {
        let err = axiosError as AxiosError
        return {
          error: {
            status: err.response?.status,
            data: err.response?.data || err.message,
          },
        }
      }
  };

export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Person'],
    endpoints: builder => {
        return {
            savePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'POST',
                    headers: {'Content-Type': 'multipart/form-data'},
                    data: dataForm,
                }),
                invalidatesTags: [{type: 'Person', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useSavePersonMutation,
} = sikolingApi;