import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";
import { IPosisiTahapPemberkasan } from "../permohonan/posisi-tahap-pemberkasan-api-slice";
import { IAuthorization } from "../security/authorization-slice";
import { IKategoriFlowLog } from "./kategori-flow-log-api-slice";

export interface IFlowLog {
    id: string|null;
    tanggal: string|null;
    kategoriFlowLog: IKategoriFlowLog|null;
    posisiTahapPemberkasan: IPosisiTahapPemberkasan|null;
    keterangan: string|null;
    pengakses: IAuthorization|null;
};

type daftarFlowLog = IFlowLog[];

export const FlowLogApiSlice = createApi({
    reducerPath: 'flowLogApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    keepUnusedDataFor: 30,
    tagTypes: ['FlowLog'],
    endpoints(builder) {
        return {
            addFlowLog: builder.mutation<IFlowLog, Partial<IFlowLog>>({
                query: (body) => ({
                    url: 'flow_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'FlowLog', id: 'LIST'}],
            }),
            updateFlowLog: builder.mutation<void, Partial<IFlowLog>>({
                query: (flowLog) => ({
                    url: 'flow_log',
                    method: 'PUT',
                    body: flowLog,
                }),
                invalidatesTags: (result, error, {id}) => {
                    return [{type: 'FlowLog', id: id!}];
                },
            }),
            deleteFlowLog: builder.mutation<{ success: boolean; id: string }, string>({
                query(idFlowLog) {
                  return {
                    url: `flow_log/${idFlowLog}`,
                    method: 'DELETE',
                  }
                },
                invalidatesTags: (result, error, idFlowLog) => {
                    return [{type: 'FlowLog', id: idFlowLog}]
                },
            }),
            getAllFlowLog: builder.query<daftarFlowLog, void>({
                query: () => 'flow_log',
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'FlowLog' as const, id: id! })
                        ),
                        { type: 'FlowLog', id: 'LIST' },
                    ]:
                    [{type: 'FlowLog', id: 'LIST'}],
            }),
            getFlowLogByUser: builder.query<daftarFlowLog, string>({
                query: (idUser) => `flow_log/user/${idUser}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'FlowLog' as const, id: id!  })
                        ),
                        { type: 'FlowLog', id: 'LIST' },
                    ]:
                    [{type: 'FlowLog', id: 'LIST'}],
            }),
            getFlowLogByKategori: builder.query<daftarFlowLog, string>({
                query: (idKategori) => `flow_log/kategori/${idKategori}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'FlowLog' as const, id: id!  })
                        ),
                        { type: 'FlowLog', id: 'LIST' },
                    ]:
                    [{type: 'FlowLog', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useAddFlowLogMutation, useUpdateFlowLogMutation,
    useDeleteFlowLogMutation, useGetAllFlowLogQuery,
    useGetFlowLogByUserQuery, useGetFlowLogByKategoriQuery
} = FlowLogApiSlice;