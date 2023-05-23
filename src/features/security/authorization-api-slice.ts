import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseRestAPIUrl } from "../config/config";
import { ISimpleResponse } from "../message/simple-response-slice";
import { IPerson } from "../person/person-slice";
import { ICredential } from "./authentication-slice";
import { IAuthor } from "./author-slice";
import { IQueryParams } from "../config/query-params-slice";
import { baseQueryWithReauth } from "../config/helper-function";

export interface PostRegistrasi {
    credential: ICredential;
    person: IPerson;
};

type daftarAuthorisasi = IAuthor[];

export const AuthorizationApiSlice = createApi({
    reducerPath: 'authorizationApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Author'],
    endpoints(builder) {
        return {
            addRegistrasi: builder.mutation<ISimpleResponse, Partial<PostRegistrasi>>({
                query: (body) => ({
                    url: `user/registrasi`,
                    method: 'POST',
                    header: {
                        'Content-Type': 'application/json;charset=UTF-8',
                    },
                    body
                }),
            }),  
            getAllAuthorisasi: builder.query<daftarAuthorisasi, IQueryParams>({
                query: (queryParams) => `authority?filters=${JSON.stringify(queryParams)}`,
                providesTags: (result) => 
                    result ?
                    [
                        ...result.map(
                            ({ id }) => ({ type: 'Author' as const, id: id as string })
                        ),
                        { type: 'Author', id: 'LIST' },
                    ]:
                    [{type: 'Author', id: 'LIST'}],
            }),
            getTotalCountAuthorisasi: builder.query<number, Pick<IQueryParams, "filters">>({
                query: (queryFilters) => `authority/count?filters=${JSON.stringify(queryFilters)}`,
            }),
        };
    },
});

export const { 
    useAddRegistrasiMutation, useGetAllAuthorisasiQuery,
    useGetTotalCountAuthorisasiQuery
} = AuthorizationApiSlice;