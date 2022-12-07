import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { RootState } from "../../app/store";
import { IResponseStatusToken, setToken } from "../security/token-slice";
import { baseRestAPIUrl } from "./config";


const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ 
    baseUrl: baseRestAPIUrl,
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).token.accessToken;
        if(accessToken != null){
            headers.set("authorization", `Bearer ${accessToken}`);
        }            
        return headers;
    }
});

export const baseQueryWithReauth: BaseQueryFn<string|FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);
    
    if (result.error && result.error.status === 500) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                const refreshResult = await baseQuery('user/refresh_token', api, extraOptions);
                if (refreshResult.error && refreshResult.error.status === 400) {
                    result = refreshResult;
                }
                else {
                    let responseStatusToken = refreshResult.data as IResponseStatusToken;
                    api.dispatch(setToken(responseStatusToken.token));
                    result = await baseQuery(args, api, extraOptions);
                }
            } finally {
                release();
            }
        }      
        else {
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};