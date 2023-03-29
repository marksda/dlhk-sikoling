import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";


export interface IPosisiTahapPemberkasan {
    id: string|null;
    nama: string|null;
    keterangan: string|null
};

type daftarPosisiTahapPenberkasan = IPosisiTahapPemberkasan[];

export const PosisiTahapPemberkasanApiSlice = createApi({
    reducerPath: 'posisiTahapPemberkasanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['PosisiTahapPemberkasan'],
    endpoints(builder) {
        return {
            addPosisiTahapPemberkasan: builder.mutation<IPosisiTahapPemberkasan, Partial<IPosisiTahapPemberkasan>>({
                query: (body) => ({
                    url: 'posisi_tahap_Pemberkasan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'PosisiTahapPemberkasan', id: 'LIST'}],
            }),
            updatePosisiTahapPemberkasan: builder.mutation<void, Partial<IPosisiTahapPemberkasan>>({
                query: (posisiTahapPemberkasan) => ({
                    url: 'posisi_tahap_Pemberkasan',
                    method: 'PUT',
                    body: posisiTahapPemberkasan,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'PosisiTahapPemberkasan', id: id!}];
                },
            }),
            deletePosisiTahapPemberkasan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idPosisiTahapPemberkasan) {
                  return {
                    url: `posisi_tahap_Pemberkasan/${idPosisiTahapPemberkasan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idPosisiTahapPemberkasan) => {
                    return [{type: 'PosisiTahapPemberkasan', id: idPosisiTahapPemberkasan}]
                },
            }),
            getAllPosisiTahapPemberkasan: builder.query<daftarPosisiTahapPenberkasan, void>({
                query: () => 'posisi_tahap_Pemberkasan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'PosisiTahapPemberkasan' as const, id: id! })
                        ),
                        { type: 'PosisiTahapPemberkasan', id: 'LIST' },
                    ] : [{type: 'PosisiTahapPemberkasan', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddPosisiTahapPemberkasanMutation, useUpdatePosisiTahapPemberkasanMutation,
    useDeletePosisiTahapPemberkasanMutation, useGetAllPosisiTahapPemberkasanQuery
} = PosisiTahapPemberkasanApiSlice;

