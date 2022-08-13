import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../../features/config/config";


export const AuthorizationApiSlice = createApi({
    reducerPath: 'authorizationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            cekUserName: builder.query<string, void>({
                query: (nama) => `user/cek_user_name?userName=${nama}`,
            }),
            
        }
    }
});

export const { useCekUserNameQuery } = AuthorizationApiSlice;