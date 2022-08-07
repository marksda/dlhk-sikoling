import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IToken } from "./token-slice";
import { baseIdentityProviderUrl } from "../../features/config/config";


export const tokenApiSlice = createApi({
    reducerPath: 'tokenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseIdentityProviderUrl,
    }),
    endpoints(builder) {
        return {
            getToken: builder.query<IToken, void>({
                // grant_type, code, redirect_uri
                query: () => `openidconnect/token`,
            }),
        }
    }
});

export const { useGetTokenQuery } = tokenApiSlice;