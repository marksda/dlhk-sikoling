import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react' 


interface IProfile {
    id: string,
    nama: string,
    url_photo: string
}

interface IKredensial {

}


export const loginApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/v1' }),
    endpoints: (builder) => ({
        getUserAutentikasi: builder.query<IProfile, string|void>({
            query: (user) => `login/user_autentikasi`
        }),
        getUserOtorisasi: builder.query<IKredensial, string|void>({
            query: (password) => `login/user_otorisasi`
        }),
    })
})

export const { useGetUserAutentikasiQuery, useGetUserOtorisasiQuery } = loginApi

 