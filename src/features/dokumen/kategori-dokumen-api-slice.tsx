import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { baseRestAPIUrl } from "../config/config";
import { IKategoriDokumen } from "./kategori-dokumen-slice";

type daftarKategoriDokumen = IKategoriDokumen[];

export const PerusahaanApiSlice = createApi({
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
                    url: 'perusahaan',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'kategoriDokumen', id: 'LIST'}],
            }),
        }
    },
});