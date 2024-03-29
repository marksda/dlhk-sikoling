import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import tokenReducer from "../features/security/token-slice";
import { TokenApiSlice } from "../features/security/token-api-slice";
import simpleResponseReducer from "../features/message/simple-response-slice";
import { JenisPermohonanSuratArahanApiSlice } from "../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { sikolingApi } from "../features/repository/service/sikoling-api-slice";
import loginReducer from "../features/login/login-slice";

export const store = configureStore({
    reducer: {
        credential: authenticationReducer,
        [AuthenticationApiSlice.reducerPath]: AuthenticationApiSlice.reducer,
        authorization: authorizationReducer,
        simpleResponse: simpleResponseReducer,
        token: tokenReducer,
        [TokenApiSlice.reducerPath]: TokenApiSlice.reducer,
        [JenisPermohonanSuratArahanApiSlice.reducerPath]: JenisPermohonanSuratArahanApiSlice.reducer,
        [sikolingApi.reducerPath]: sikolingApi.reducer,
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(AuthenticationApiSlice.middleware)
                                            .concat(TokenApiSlice.middleware)
                                            .concat(JenisPermohonanSuratArahanApiSlice.middleware)
                                            .concat(sikolingApi.middleware)
});

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
