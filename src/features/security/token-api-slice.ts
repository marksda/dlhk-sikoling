import { createApi } from "@reduxjs/toolkit/query/react";
import { IResponseStatusToken } from "./token-slice";
import { baseQueryForToken } from "../config/helper-function";
import { ICredential } from "../entity/credential";


export const TokenApiSlice = createApi({
    reducerPath: 'tokenApi',
    baseQuery: baseQueryForToken,
    endpoints(builder) {
        return {
            getToken: builder.mutation<IResponseStatusToken, ICredential>({
                query: (credentialData) => ({
                    url: `/user/get_token`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: credentialData,
                }),
            }), 
            getRefreshToken: builder.mutation<IResponseStatusToken, string>({
                query: (refreshToken) => ({
                    url: `/user/refresh_token`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'text/plain;charset=UTF-8',
                    },
                    body: refreshToken,
                }),
            }), 
        }
    }
});

export const { useGetTokenMutation, useGetRefreshTokenMutation } = TokenApiSlice;