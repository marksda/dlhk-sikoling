import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { baseUrl } from "../config/config";
import { IJenisKelamin } from "./jenis-kelamin-slice";

export const JenisKelaminApiSlice = createApi({
    reducerPath: 'jenisKelaminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
    }),
    endpoints(builder) {
        return {
            getAllJenisKelamin: builder.query<IJenisKelamin[], void>({
                query: () => `/sex`,
            }),
        }
    }
})

export const { useGetAllJenisKelaminQuery } = JenisKelaminApiSlice