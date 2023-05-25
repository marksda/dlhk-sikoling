import { createApi } from "@reduxjs/toolkit/query/react";
import { ISimpleResponse } from "../message/simple-response-slice";
import { IPerson } from "../person/person-slice";
import { ICredential } from "./authentication-slice";
import { IQueryParams } from "../config/query-params-slice";
import { baseQueryWithReauth } from "../config/helper-function";
import { IHakAkses } from "../hak-akses/hak-akses-api-slice";

export interface PostRegistrasi {
    credential: ICredential;
    person: IPerson;
};

export interface IAuthor {
    id: string|null;
    tanggal: string|null;
    hakAkses: Partial<IHakAkses>|null;
    person: Partial<IPerson>|null;
    statusInternal: boolean|null;
    userName: string|null;
    verified: boolean|null;
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