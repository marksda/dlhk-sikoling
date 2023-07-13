import { createApi } from "@reduxjs/toolkit/dist/query/react";
import { baseQueryWithReauth } from "../../config/helper-function";
import { IPerson } from "../../entity/person";


export const sikolingApi = createApi({
    reducerPath: 'sikolingApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Person'],
    endpoints: builder => {
        return {
            savePerson: builder.mutation<IPerson, FormData>({
                query: (dataForm) => ({
                    url: 'person',
                    method: 'POST',
                    headers: {'Content-Type': 'multipart/form-data'},
                    body: dataForm,
                }),
                invalidatesTags: [{type: 'Person', id: 'LIST'}],
            }),
        }
    }
});

export const {
    useSavePersonMutation,
} = sikolingApi;