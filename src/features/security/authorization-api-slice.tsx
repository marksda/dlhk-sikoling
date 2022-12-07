import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../../features/config/config";
import { ISimpleResponse } from "../message/simple-response-slice";
import { IPerson } from "../person/person-slice";
import { ICredential } from "./authentication-slice";
import { IResponseStatusToken } from "./token-slice";

export interface PostRegistrasi {
    auth: ICredential;
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
        };
    },
});

export const { useAddRegistrasiMutation } = AuthorizationApiSlice;