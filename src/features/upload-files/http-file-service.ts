import axios from "axios";
import { urlApiSikoling } from "../config/config";
import { IConfig } from "../entity/onlyoffice-config-editor";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IResponseStatusToken, setToken } from "../security/token-slice";

const restAxiosAPI = () => {
    const token = useAppSelector((state) => state.token);
    const dispatch = useAppDispatch();
    const api = axios.create({
        baseURL: urlApiSikoling,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
        (config) => {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
            return config;
        },
        (error) => Promise.reject(error)
    );
    // Add a response interceptor to refresh the JWT token if it's expired
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const originalRequest = error.config;

            // If the error is a 401 and we have a refresh token, refresh the JWT token
            if (error.response.status === 401) {
                let data = JSON.stringify({refresh_token: token.refreshToken});

                api.post(`/user/refresh_token/${token.userName}`, data)
                    .then((response) => {
                        let hasil = response.data as IResponseStatusToken;
                        localStorage.removeItem('token');
                        localStorage.setItem('token', JSON.stringify(hasil.token));
                        dispatch(setToken(hasil.token));

                        // Re-run the original request that was intercepted
                        originalRequest.headers.Authorization = `Bearer ${hasil.token}`;
                        api(originalRequest)
                            .then((response) => {
                                return response.data;
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                        // return api(originalRequest)
                    })
                    .catch((err) => {
                        // If there is an error refreshing the token, log out the user
                        console.log(err);
                    });
            }

            // Return the original error if we can't handle it
            return Promise.reject(error);
        }
    );

    const uploadFile = (file: any, subPath: string, onUploadProgress: any) => {
        let formData = new FormData();
        formData.append('file', file);
        // let i: number = 1;
    
        // for(let dataFile of files) {
        //     formData.append(`file-${i}`, dataFile);
        //     i++;
        // }    
        
        return api.post(subPath, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
            },
            onUploadProgress,
        })
        .then((response) => response.data.uri)
        .catch((response) => response.error);
    };
    
    const getOnlyofficeConfigEditor = (uri: string) => {
        return api.get<IConfig>(`/onlyoffice/config?fileNameParam=${uri}`,{
            headers: {
                Accept: "application/json",
            },
        })
        .then((response) => response.data)
        .catch((response) => response.error);
    }

    return {getOnlyofficeConfigEditor, uploadFile};
};

export const {getOnlyofficeConfigEditor, uploadFile} = restAxiosAPI();