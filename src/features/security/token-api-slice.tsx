import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IResponseStatusToken, IToken } from "./token-slice";
import { baseIdentityProviderUrl, baseRestAPIUrl } from "../../features/config/config";
import { ICredential } from "./authentication-slice";


export const TokenApiSlice = createApi({
    reducerPath: 'tokenApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            getToken: builder.mutation<IResponseStatusToken, ICredential>({
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

export const { useGetTokenMutation } = TokenApiSlice;