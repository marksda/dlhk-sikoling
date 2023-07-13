import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import axios, { AxiosError } from "axios";
import { RootState } from "../../app/store";
import { resetCredential } from "../security/authentication-slice";
import { IResponseStatusToken, resetToken, setToken } from "../security/token-slice";
import { sikolingBaseRestAPIUrl } from "./config";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ 
    baseUrl: sikolingBaseRestAPIUrl,
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
                const refreshResult = await baseQuery(
                'user/refresh_token',
                api,
                extraOptions
                )
                if (refreshResult.data) {
                    // api.dispatch(tokenReceived(refreshResult.data))
                    // retry the initial query
                    let hasil = refreshResult.data as IResponseStatusToken;
                    localStorage.removeItem('token');
                    localStorage.setItem('token', JSON.stringify(hasil.token));
                    api.dispatch(setToken(hasil.token));
                    result = await baseQuery(args, api, extraOptions);
                } 
                else {
                    api.dispatch(resetToken());
                }
                // let x = args as FetchArgs;
                // const refreshToken = (api.getState() as RootState).token.refreshToken;
                // try {
                //     const refreshResult = await axios.post(
                //         `${sikolingBaseRestAPIUrl}/user/refresh_token`, 
                //         refreshToken,
                //         {
                //             headers: {
                //                 'Content-Type': 'text/plain',
                //             }
                //         });
                    let hasil = refreshResult.data as IResponseStatusToken;
                    localStorage.removeItem('token');
                    localStorage.setItem('token', JSON.stringify(hasil.token));
                    api.dispatch(setToken(hasil.token));
                //     result = await baseQuery(args, api, extraOptions);
                // }
                // catch (axiosError) {
                //     let err = axiosError as AxiosError;
                //     localStorage.removeItem('token');
                //     api.dispatch(resetToken());
                //     result = {
                //         error: {                            
                //             status: err.response?.status as number,
                //             data: err.response?.data || err.message,
                //         },
                //     }
                // }
            } finally {
                release();
            }
        }      
        else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const baseQueryForToken: BaseQueryFn<string|FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {

    let result = await baseQuery(args, api, extraOptions); 
    if(result.error == undefined) {
        let hasil = result.data as IResponseStatusToken;
        localStorage.removeItem('token');
        localStorage.setItem('token', JSON.stringify(hasil.token));        
        api.dispatch(setToken(hasil.token));
        api.dispatch(resetCredential());
    }
    
    return result;
};

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === "object" && error != null && "status" in error;
};

export const isErrorWithMessage= (error: unknown): error is {message: string} => {
    return (
        typeof error === "object" &&
        error != null &&
        "message" in error &&
        typeof (error as any).message === "string"
      );
};

export const parseNpwp = (npwp: string): string => {
    return npwp.replace(/[_\-\.]/g, '');
};

export const invertParseNpwp = (npwp: string): string => {
    return npwp.length == 15 ? npwp.substring(0,2)+"."+npwp.substring(2,5)+"."+npwp.substring(5,8)+"."+npwp.substring(8,9)+"-"+npwp.substring(9,12)+"."+npwp.substring(12,15):"-";
};

export const getFileType = (mime: string) => {
    mime = mime.toLowerCase();
    let hasil: string;
    switch (mime) {
        case 'image/bmp':
        case 'image/svg+xml':
        case 'image/jpeg':
        case 'image/tiff':
        case 'image/gif':
        case 'image/png':
            hasil = 'image'
            break;
        case 'application/pdf':
            hasil = 'pdf';
            break;
        case 'application/msword':
            hasil = 'doc';
            break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            hasil = 'docx';
            break;
        case 'application/vnd.ms-powerpoint':
            hasil = 'ppt';
            break;
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            hasil = 'pptx';
            break;
        case 'application/vnd.ms-excel':
            hasil = 'xls';
            break;
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            hasil = 'xlsx'
            break;
        default:
            hasil = 'tidak terdefinisi';
            break;
    }        

    return hasil;
}