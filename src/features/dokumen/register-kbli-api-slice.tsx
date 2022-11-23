import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IRegisterKbli } from "./register-kbli-slice";


type daftarRegisterKbli = IRegisterKbli[];

export const RegisterKbliApiSlice = createApi({
    reducerPath: 'kbliApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['RegisterKbli', 'RegisterKbliPage', 'RegisterKbliNib', 'RegisterKbliNibPage', 'RegisterKbliKode', 'RegisterKbliKodePage', 'RegisterKbliNama', 'RegisterKbliNamaPage'],
    endpoints(builder) {
        return {
            addRegisterKbli: builder.mutation<IRegisterKbli, Partial<IRegisterKbli>>({
                query: (body) => ({
                    url: 'register_kbli',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'RegisterKbli', id: 'LIST'}, {type: 'RegisterKbliPage', id: 'LIST'}, {type: 'RegisterKbliNib', id: 'LIST'}, {type: 'RegisterKbliNibPage', id: 'LIST'}, {type: 'RegisterKbliKode', id: 'LIST'}, {type: 'RegisterKbliKodePage', id: 'LIST'}, {type: 'RegisterKbliNama', id: 'LIST'}, {type: 'RegisterKbliNamaPage', id: 'LIST'}]
            }),
            updateRegisterKbli: builder.mutation<void, {nib: string; kode: string; registerKbli: IRegisterKbli}>({
                query: ({kode, nib, registerKbli}) => ({
                    url: `register_kbli/${nib}/${kode}`,
                    method: 'PUT',
                    body: registerKbli,
                }),
                invalidatesTags: (result, error, { nib, kode }) => [{type: 'RegisterKbli', id: `${nib}-${kode}`}, {type: 'RegisterKbliPage', id: `${nib}-${kode}`}, {type: 'RegisterKbliNib', id: `${nib}-${kode}`}, {type: 'RegisterKbliNibPage', id: `${nib}-${kode}`}, {type: 'RegisterKbliKode', id: `${nib}-${kode}`}, {type: 'RegisterKbliKodePage', id: `${nib}-${kode}`}, {type: 'RegisterKbliNama', id: `${nib}-${kode}`}, {type: 'RegisterKbliNamaPage', id: `${nib}-${kode}`}]
            }),
            deleteRegisterKbli: builder.mutation<{ success: boolean; id: string }, {nib: string; kode: string}>({
                query({nib, kode} ) {
                  return {
                    url: `register_kbli/${nib}/${kode}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, {nib, kode}) => [{type: 'RegisterKbli', id: `${nib}-${kode}`}, {type: 'RegisterKbliPage', id: `${nib}-${kode}`}, {type: 'RegisterKbliNib', id: `${nib}-${kode}`}, {type: 'RegisterKbliNibPage', id: `${nib}-${kode}`}, {type: 'RegisterKbliKode', id: `${nib}-${kode}`}, {type: 'RegisterKbliKodePage', id: `${nib}-${kode}`}, {type: 'RegisterKbliNama', id: `${nib}-${kode}`}, {type: 'RegisterKbliNamaPage', id: `${nib}-${kode}`}]
            }),
            getAllRegisterKbli: builder.query<daftarRegisterKbli, void>({
                query: () => `register_kbli`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ nib, kode }) => ({ type: 'RegisterKbli' as const, id: `${nib}-${kode}` })
                        ),
                        { type: 'RegisterKbli', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbli', id: 'LIST'}],
            }),
            getRegisterKbliByPage: builder.query<daftarRegisterKbli, {page: number; pageSize: number}>({
                query: ({page = 1, pageSize = 10}) => `register_kbli/page?page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ nib, kode }) => ({ type: 'RegisterKbli' as const, id: `${nib}-${kode}` })
                        ),
                        { type: 'RegisterKbli', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbli', id: 'LIST'}],
            }),
            
        }
    }
});

export const { 
    useAddRegisterKbliMutation, 
    useUpdateRegisterKbliMutation, 
    useDeleteRegisterKbliMutation,
    useGetAllRegisterKbliQuery,
} = RegisterKbliApiSlice;