import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { RootState } from "../../app/store";
import { IResponseStatusToken, resetToken, setToken } from "../security/token-slice";
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
    },

});


export const baseQueryWithReauth: BaseQueryFn<string|FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);
    
    if (result.error && result.error.status === 500) {
        if (!mutex.isLocked()) {
            const release = await mutex.acquire();
            try {
                let x = args as FetchArgs;
                const refreshToken = (api.getState() as RootState).token.refreshToken;
                try {
                    const refreshResult = await axios.post(
                        `${baseRestAPIUrl}user/refresh_token`, 
                        refreshToken,
                        {
                            headers: {
                                'Content-Type': 'text/plain',
                            }
                        });
                    let hasil = refreshResult.data as IResponseStatusToken;
                    localStorage.removeItem('token');
                    localStorage.setItem('token', JSON.stringify(hasil.token));
                    api.dispatch(setToken(hasil.token));
                    result = await baseQuery(args, api, extraOptions);
                }
                catch (axiosError) {
                    let err = axiosError as AxiosError;
                    localStorage.removeItem('token');
                    api.dispatch(resetToken());
                    result = {
                        error: {                            
                            status: err.response?.status as number,
                            data: err.response?.data || err.message,
                        },
                    }
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