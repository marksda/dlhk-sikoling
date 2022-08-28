import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../../features/config/config";
import { IAuthentication } from "./authorization-slice";
import { IResponseStatusToken } from "./token-slice";


export const AuthorizationApiSlice = createApi({
    reducerPath: 'authorizationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            cekUserName: builder.mutation<boolean, string>({
                // query: (nama) => `user/cek_user_name?userName=${nama}`,
                query: (nama) => ({
                    url: `user/cek_user_name?userName=${nama}`,
                    method: 'GET',
                }),
            }),
            getToken: builder.mutation<IResponseStatusToken, IAuthentication>({
                query: (authenticationData) => ({
                    url: `user/get_token`,
                    method: 'POST',
                    body: authenticationData,
                }),
            }),            
        }
    }
});

export const { useCekUserNameMutation, useGetTokenMutation } = AuthorizationApiSlice;