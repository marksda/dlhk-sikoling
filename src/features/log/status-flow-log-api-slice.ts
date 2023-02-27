import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../config/helper-function";

export interface IStatusFlowLog {
    id: string|null;
    nama: string|null;
};

type daftarStatusFlowLog = IStatusFlowLog[];

export const StatusFlowLogApiSlice = createApi({
    reducerPath: 'statusFlowLogApi',
    baseQuery: baseQueryWithReauth,
    refetchOnReconnect: true,
    tagTypes: ['StatusFlowLog'],
    endpoints(builder) {
        return {
            addStatusFlowLog: builder.mutation<IStatusFlowLog, Partial<IStatusFlowLog>>({
                query: (body) => ({
                    url: 'status_flow_log',
                    method: 'POST',
                    body,
                }),
                invalidatesTags: [{type: 'StatusFlowLog', id: 'LIST'}],
            }),
        }
    }        
});

export const {
    useAddStatusFlowLogMutation,
} = StatusFlowLogApiSlice;

