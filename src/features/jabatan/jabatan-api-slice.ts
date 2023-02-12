import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IJabatan } from "./jabatan-slice";

type daftarJabatan = IJabatan[];

export const JabatanApiSlice = createApi({
    reducerPath: 'jabatanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes:['Jabatan'],
    endpoints(builder) {
        return {
            getAllJabatan: builder.query<daftarJabatan, void>({
                query: () => ({
                    url: 'jabatan_perusahaan',
                    method: 'GET'
                }),
                providesTags: (result) => 
                result ?
                [
                    ...result.map(
                        ({ id }) => ({ type: 'Jabatan' as const, id: id as string})
                    ),
                    { type: 'Jabatan', id: 'LIST' },
                ] :
                [{type: 'Jabatan', id: 'LIST'}],
            }),
        };
    }
});

export const {
    useGetAllJabatanQuery
} = JabatanApiSlice;