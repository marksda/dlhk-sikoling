import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import { OtoritasApiSlice } from "../features/repository/service/otoritas-api-slice";
import tokenReducer from "../features/security/token-slice";
import { TokenApiSlice } from "../features/security/token-api-slice";
import simpleResponseReducer from "../features/message/simple-response-slice";
import kbliReducer from "../features/repository/ssot/kbli-slice";
import { KbliApiSlice } from "../features/repository/service/kbli-api-slice";
import registerKbliReducer from "../features/repository/ssot/register-kbli-slice";
import { RegisterKbliApiSlice } from "../features/repository/service/register-kbli-api-slice";
import { KategoriPermohonanApiSlice } from "../features/permohonan/kategori-permohonan-api-slice";
import { RegisterPermohonanApiSlice } from "../features/permohonan/register-permohonan-api-slice";
import { JenisPermohonanSuratArahanApiSlice } from "../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { FlowLogApiSlice } from "../features/log/flow-log-api-slice";
import { StatusFlowLogApiSlice } from "../features/log/status-flow-log-api-slice";
import { KategoriFlowLogApiSlice } from "../features/log/kategori-flow-log-api-slice";
import { StatusWaliPermohonanApiSlice } from "../features/permohonan/status-wali-api-slice";
import { PosisiTahapPemberkasanApiSlice } from "../features/permohonan/posisi-tahap-pemberkasan-api-slice";
import { RegisterOtoritasPerusahaanApiSlice } from "../features/repository/service/register-otoritas-perusahaan-api-slice";
import { sikolingApi } from "../features/repository/service/sikoling-api-slice";

// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice";
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        credential: authenticationReducer,
        [AuthenticationApiSlice.reducerPath]: AuthenticationApiSlice.reducer,
        authorization: authorizationReducer,
        [OtoritasApiSlice.reducerPath]: OtoritasApiSlice.reducer,
        simpleResponse: simpleResponseReducer,
        token: tokenReducer,
        [TokenApiSlice.reducerPath]: TokenApiSlice.reducer,
        kbli: kbliReducer,
        [KbliApiSlice.reducerPath]: KbliApiSlice.reducer,
        registerKbli: registerKbliReducer,
        [RegisterKbliApiSlice.reducerPath]: RegisterKbliApiSlice.reducer,
        [KategoriPermohonanApiSlice.reducerPath]: KategoriPermohonanApiSlice.reducer,
        [RegisterPermohonanApiSlice.reducerPath]: RegisterPermohonanApiSlice.reducer,
        [JenisPermohonanSuratArahanApiSlice.reducerPath]: JenisPermohonanSuratArahanApiSlice.reducer,
        [StatusWaliPermohonanApiSlice.reducerPath]: StatusWaliPermohonanApiSlice.reducer,
        [PosisiTahapPemberkasanApiSlice.reducerPath]: PosisiTahapPemberkasanApiSlice.reducer,
        [FlowLogApiSlice.reducerPath]: FlowLogApiSlice.reducer,
        [StatusFlowLogApiSlice.reducerPath]: StatusFlowLogApiSlice.reducer,
        [KategoriFlowLogApiSlice.reducerPath]: KategoriFlowLogApiSlice.reducer,
        [RegisterOtoritasPerusahaanApiSlice.reducerPath]: RegisterOtoritasPerusahaanApiSlice.reducer,
        [sikolingApi.reducerPath]: sikolingApi.reducer,
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(AuthenticationApiSlice.middleware)
                                            .concat(OtoritasApiSlice.middleware)
                                            .concat(TokenApiSlice.middleware)
                                            .concat(KbliApiSlice.middleware)
                                            .concat(RegisterKbliApiSlice.middleware)
                                            .concat(RegisterPermohonanApiSlice.middleware)
                                            .concat(FlowLogApiSlice.middleware)
                                            .concat(StatusFlowLogApiSlice.middleware)
                                            .concat(KategoriFlowLogApiSlice.middleware)
                                            .concat(JenisPermohonanSuratArahanApiSlice.middleware)
                                            .concat(StatusWaliPermohonanApiSlice.middleware)
                                            .concat(PosisiTahapPemberkasanApiSlice.middleware)
                                            .concat(KategoriPermohonanApiSlice.middleware)
                                            .concat(sikolingApi.middleware)
                                            .concat(RegisterOtoritasPerusahaanApiSlice.middleware),
});

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
