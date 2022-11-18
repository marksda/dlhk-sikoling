import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IRegisterDokumen } from "./register-dokumen-slice";

type daftarRegisterDokumen = IRegisterDokumen[];

export const RegisterDokumenApiSlice = createApi({
    reducerPath: 'registerDokumenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['RegisterDokumen', 'RegisterDokumenPage', 'RegisterDokumenNama', 'RegisterDokumenNamaPage'],
    endpoints(builder) {
        return {
            addRegisterDokumen: builder.mutation<IRegisterDokumen, Partial<IRegisterDokumen>>({
                query: (body) => ({
                    url: 'register_dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterDokumen', id: 'LIST'}, {type: 'RegisterDokumenPage', id: 'LIST'}, {type: 'RegisterDokumenNama', id: 'LIST'}, {type: 'RegisterDokumenNamaPage', id: 'LIST'}],
            }),
            updateRegisterDokumen: builder.mutation<void, Pick<IRegisterDokumen, 'id'> & Partial<IRegisterDokumen>>({
                query: ({id, ...patch}) => ({
                    url: `register_dokumen/${id}`,
                    method: 'PUT',
                    patch,
                }),
                invalidatesTags: (result, error, { id }) => [{type: 'RegisterDokumen', id}, {type: 'RegisterDokumenPage', id}, {type: 'RegisterDokumenNama', id}, {type: 'RegisterDokumenNamaPage', id}],
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `register_dokumen/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'RegisterDokumen', id }, { type: 'RegisterDokumenPage', id }, { type: 'RegisterDokumenNama', id }, { type: 'RegisterDokumenNamaPage', id }],
            }),
            getAllRegisterDokumen: builder.query<daftarRegisterDokumen, void>({
                query: () => `register_dokumen`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterDokumen' as const, id })
                        ),
                        { type: 'RegisterDokumen', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumen', id: 'LIST'}],
            }),
            getRegisterDokumenByPage: builder.query<daftarRegisterDokumen, {page: number, pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `register_dokumen/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'RegisterDokumenPage' as const, id })
                        ),
                        { type: 'RegisterDokumenPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterDokumenPage', id: 'LIST'}],
            }),
        };
    }
});

export const {
    useAddRegisterDokumenMutation, useUpdateRegisterDokumenMutation,
    useDeleteKategoriDokumenMutation, useGetAllRegisterDokumenQuery,

} = RegisterDokumenApiSlice;