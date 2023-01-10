import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";

export interface IJenisPermohonanSuratArahan {
    id: string|null;
    keterangan: string|null;
};

type daftarJenisPermohonanSuratArahan = IJenisPermohonanSuratArahan[];

export const JenisPermohonanSuratArahanApiSlice = createApi({
    reducerPath: 'jenisPermohonanSuratArahanAPI',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['JenisPermohonanSuratArahan'],
    endpoints(builder) {
        return {
            addJenisPermohonanSuratArahan: builder.mutation<IJenisPermohonanSuratArahan, Partial<IJenisPermohonanSuratArahan>>({
                query: (body) => ({
                    url: 'jenis_permohonan_surat_arahan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'JenisPermohonanSuratArahan'}],
            }),
            updateJenisPermohonanSuratArahan: builder.mutation<void, Partial<IJenisPermohonanSuratArahan>>({
                query: (JenisPermohonanSuratArahan) => ({
                    url: 'jenis_permohonan_surat_arahan',
                    method: 'PUT',
                    body: JenisPermohonanSuratArahan,
                }),
                invalidatesTags: (result, error, jenisPermohonanSuratArahan) => {
                    return [{type: 'JenisPermohonanSuratArahan', id: jenisPermohonanSuratArahan.id!}, {type: 'JenisPermohonanSuratArahan', id: 'LIST'}];
                },
            }),
            deleteJenisPermohonanSuratArahan: builder.mutation<{ success: boolean; id: string }, string>({
                query(idJenisPermohonanSuratArahan) {
                  return {
                    url: `jenis_permohonan_surat_arahan/${idJenisPermohonanSuratArahan}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idJenisPermohonanSuratArahan) => {
                    return [{type: 'JenisPermohonanSuratArahan', id: idJenisPermohonanSuratArahan}]
                },
            }),
            getAllJenisPermohonanSuratArahan: builder.query<daftarJenisPermohonanSuratArahan, void>({
                query: () => 'jenis_permohonan_surat_arahan',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'JenisPermohonanSuratArahan' as const, id: id as string })
                        ),
                        { type: 'JenisPermohonanSuratArahan', id: 'LIST' },
                    ]:
                    [{type: 'JenisPermohonanSuratArahan', id: 'LIST'}],
            })
        }
    }
});

export const { 
    useAddJenisPermohonanSuratArahanMutation, useUpdateJenisPermohonanSuratArahanMutation,
    useDeleteJenisPermohonanSuratArahanMutation, useGetAllJenisPermohonanSuratArahanQuery
} = JenisPermohonanSuratArahanApiSlice
