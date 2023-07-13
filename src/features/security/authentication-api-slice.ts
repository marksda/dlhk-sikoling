import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { sikolingBaseRestAPIUrl } from "../config/config";

export const AuthenticationApiSlice = createApi({
    reducerPath: 'authenticationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: sikolingBaseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            cekUserName: builder.query<boolean, string>({
                query: (nama) => ({
                    url: `user/cek_user_name?userName=${nama}`,
                    method: 'GET',
                }),
            }),
        };
    },
});

export const { useCekUserNameQuery } = AuthenticationApiSlice;