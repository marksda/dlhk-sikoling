import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { baseRestAPIUrl } from "../config/config";
import { IKategoriDokumen } from "./kategori-dokumen-slice";

type daftarKategoriDokumen = IKategoriDokumen[];

export const KategoriDokumenApiSlice = createApi({
    reducerPath: 'kategoriDokumenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['kategoriDokumen'],
    endpoints(builder) {
        return {
            addKategoriDokumen: builder.mutation({
                query: (body) => ({
                    url: 'kategori_dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'kategoriDokumen', id: 'LIST'}],
            }),
            updateKategoriDokumen: builder.mutation({
                query: (body) => ({
                    url: 'kategori_dokumen',
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: [{type: 'kategoriDokumen', id: 'LIST'}],
            }),
            deleteKategoriDokumen: builder.mutation<{ success: boolean; id: string }, string>({
                query(id) {
                  return {
                    url: `posts/${id}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, id) => [{ type: 'kategoriDokumen', id }],
            }),
            getAllKategoriDokumen: builder.query<daftarKategoriDokumen, void>({
                query: () => `perusahaan`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'kategoriDokumen' as const, id })
                        ),
                        { type: 'kategoriDokumen', id: 'LIST' },
                    ]:
                    [{type: 'kategoriDokumen', id: 'LIST'}],
            }),
        }
    },
});

export const {  } = KategoriDokumenApiSlice;