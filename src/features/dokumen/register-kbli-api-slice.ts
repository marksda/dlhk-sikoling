import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { IRegisterKbli } from "../entity/register-kbli";

type daftarRegisterKbli = IRegisterKbli[];

export const RegisterKbliApiSlice = createApi({
    reducerPath: 'registerKbliApi',
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
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbli' as const, id: `${idNib}-${idKbli}` })
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
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbli' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbli', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbli', id: 'LIST'}],
            }),
            getRegisterKbliByNama: builder.query<daftarRegisterKbli, string>({
                query: (nama) => `register_kbli/nama?nama=${nama}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliNama' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliNama', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliNama', id: 'LIST'}],
            }),
            getRegisterKbliByNamaAndPage: builder.query<daftarRegisterKbli, {nama: string; page: number; pageSize: number}>({
                query: ({nama = '', page=1, pageSize=10}) => `register_kbli/nama/page?nama=${nama}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliNamaPage' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliNamaPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliNamaPage', id: 'LIST'}],
            }),
            getRegisterKbliByKode: builder.query<daftarRegisterKbli, string>({
                query: (kode) => `register_kbli/kode?kode=${kode}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliKode' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliKode', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliKode', id: 'LIST'}],
            }),
            getRegisterKbliByKodeAndPage: builder.query<daftarRegisterKbli, {kode: string; page: number; pageSize: number}>({
                query: ({kode = '', page=1, pageSize=10}) => `register_kbli/kode/page?kode=${kode}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliKodePage' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliKodePage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliKodePage', id: 'LIST'}],
            }),
            getRegisterKbliByNib: builder.query<daftarRegisterKbli, string>({
                query: (nib) => `register_kbli/nib?nib=${nib}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliNib' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliNib', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliNib', id: 'LIST'}],
            }),
            getRegisterKbliByNibAndPage: builder.query<daftarRegisterKbli, {nib: string; page: number; pageSize: number}>({
                query: ({nib = '', page=1, pageSize=10}) => `register_kbli/nib/page?kode=${nib}&page=${page}&pageSize=${pageSize}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ idNib, idKbli }) => ({ type: 'RegisterKbliNibPage' as const, id: `${idNib}-${idKbli}` })
                        ),
                        { type: 'RegisterKbliNibPage', id: 'LIST' },
                    ]:
                    [{type: 'RegisterKbliNibPage', id: 'LIST'}],
            }),
        }
    }
});

export const { 
    useAddRegisterKbliMutation, 
    useUpdateRegisterKbliMutation, 
    useDeleteRegisterKbliMutation,
    useGetAllRegisterKbliQuery,
    useGetRegisterKbliByPageQuery,
    useGetRegisterKbliByNamaQuery,
    useGetRegisterKbliByKodeQuery,
    useGetRegisterKbliByKodeAndPageQuery,
    useGetRegisterKbliByNibQuery,
    useGetRegisterKbliByNibAndPageQuery,
} = RegisterKbliApiSlice;