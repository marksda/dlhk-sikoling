import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../../features/config/config";
import { ISimpleResponse } from "../message/simple-response-slice";
import { IPerson } from "../person/person-slice";
import { IAuthentication } from "./authentication-slice";
import { IResponseStatusToken } from "./token-slice";

export interface PostRegistrasi {
    auth: IAuthentication;
    person: IPerson;
};

export const AuthorizationApiSlice = createApi({
    reducerPath: 'authorizationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            addRegistrasi: builder.mutation<ISimpleResponse, Partial<PostRegistrasi>>({
                query: (body) => ({
                    url: `user/registrasi`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body
                }),
            }),   
            getToken: builder.mutation<IResponseStatusToken, IAuthentication>({
                query: (authenticationData) => ({
                    url: `user/get_token`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body: authenticationData,
                }),
            }),            
        };
    },
});

export const { useAddRegistrasiMutation, useGetTokenMutation } = AuthorizationApiSlice;