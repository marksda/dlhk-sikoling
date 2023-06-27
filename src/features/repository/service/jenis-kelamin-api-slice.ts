import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { baseRestAPIUrl } from "../../config/config";
import { IJenisKelamin } from "../../entity/jenis-kelamin";

export const JenisKelaminApiSlice = createApi({
    reducerPath: 'jenisKelaminApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseRestAPIUrl,
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