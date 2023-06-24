import { createApi } from "@reduxjs/toolkit/query/react";
import { ISimpleResponse } from "../message/simple-response-slice";
import { IPerson } from "../repository/ssot/person-slice";
import { IQueryParams } from "../config/query-params-slice";
import { baseQueryWithReauth } from "../config/helper-function";
import { ICredential } from "../entity/credential";
import { IOtoritas } from "../entity/otoritas";

export interface PostRegistrasi {
    credential: ICredential;
    person: IPerson;
};

type daftarAuthorisasi = IOtoritas[];

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