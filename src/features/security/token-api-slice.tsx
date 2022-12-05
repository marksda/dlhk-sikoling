import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IToken } from "./token-slice";
import { baseIdentityProviderUrl } from "../../features/config/config";
import { IAuthentication } from "./authentication-slice";


export const tokenApiSlice = createApi({
    reducerPath: 'tokenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseIdentityProviderUrl,
    }),
    endpoints(builder) {
        return {
            getToken: builder.query<IToken, IAuthentication>({
                query: (authenticationData) => ({
                    url: `user/get_token`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: authenticationData,
                }),
            }),
        }
    }
});

export const { useGetTokenQuery } = tokenApiSlice;