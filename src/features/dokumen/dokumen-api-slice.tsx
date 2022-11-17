import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { baseRestAPIUrl } from "../config/config";
import { IDokumen } from "./dokumen-slice";

type DokumenResponse = IDokumen[];

export const DokumenApiSlice = createApi({
    reducerPath: 'dokumenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes:['Dokumen'],
    endpoints(builder) {
        return {
            addDokumen: builder.mutation({
                query: (body) => ({
                    url: 'dokumen',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'Dokumen', id: 'LIST'}],
            }),
        }
    }
});

export const {} = DokumenApiSlice;