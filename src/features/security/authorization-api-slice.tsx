import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../../features/config/config";


export const AuthorizationApiSlice = createApi({
    reducerPath: 'authorizationApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
    }),
    endpoints(builder) {
        return {
            cekUserName: builder.mutation<string, void|string>({
                query: (nama) => `user/cek_user_name?userName=${nama}`,
            }),
            
        }
    }
});

export const { useCekUserNameMutation } = AuthorizationApiSlice;