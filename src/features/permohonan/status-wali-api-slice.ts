import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";

export interface IStatusWali {
    id: string|null;
    nama: string|null;
}

type daftarStatusWaliPermohonan = IStatusWali[];

export const StatusWaliPermohonanApiSlice = createApi({
    reducerPath: 'statusWaliPermohonanApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes: ['StatusWaliPermohonan'],
    endpoints(builder) {
        return {
            getAllStatusWaliPermohonan: builder.query<daftarStatusWaliPermohonan, void>({
                query: () => 'status_wali',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'StatusWaliPermohonan' as const, id: id! })
                        ),
                        { type: 'StatusWaliPermohonan', id: 'LIST' },
                    ]:
                    [{type: 'StatusWaliPermohonan', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useGetAllStatusWaliPermohonanQuery
} = StatusWaliPermohonanApiSlice;
