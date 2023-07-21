import { configureStore } from "@reduxjs/toolkit";
import { JabatanApiSlice } from "../features/repository/service/jabatan-api-slice";
import jenisKelaminReducer from "../features/repository/ssot/jenis-kelamin-slice";
import personReducer from "../features/repository/ssot/person-slice";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import { OtoritasApiSlice } from "../features/repository/service/otoritas-api-slice";
import tokenReducer from "../features/security/token-slice";
import { TokenApiSlice } from "../features/security/token-api-slice";
import simpleResponseReducer from "../features/message/simple-response-slice";
import { ModelPerizinanApiSlice } from "../features/repository/service/model-perizinan-api-slice"; 
import { SkalaUsahaApiSlice } from "../features/repository/service/skala-usaha-api-slice";
import { KategoriPelakuUsahaApiSlice } from "../features/repository/service/kategori-pelaku-usaha-api-slice";
import { PelakuUsahaApiSlice } from "../features/repository/service/pelaku-usaha-api-slice";
import perusahaanReducer from "../features/repository/ssot/perusahaan-slice";
import { RegisterPerusahaanApiSlice } from "../features/repository/service/register-perusahaan-api-slice";
import kategoriDokumenReducer from "../features/repository/ssot/kategori-dokumen-slice";
import { KategoriDokumenApiSlice } from "../features/repository/service/kategori-dokumen-api-slice";
import dokumenReducer from "../features/repository/ssot/dokumen-slice";
import { DokumenApiSlice } from "../features/repository/service/dokumen-api-slice";
import registerDokumenReducer from "../features/dokumen/register-dokumen-slice";
import { RegisterDokumenApiSlice } from "../features/dokumen/register-dokumen-api-slice";
import kbliReducer from "../features/repository/ssot/kbli-slice";
import { KbliApiSlice } from "../features/repository/service/kbli-api-slice";
import registerKbliReducer from "../features/repository/ssot/register-kbli-slice";
import { RegisterKbliApiSlice } from "../features/repository/service/register-kbli-api-slice";
import registerPerusahaanReducer from "../features/repository/ssot/register-perusahaan-slice";
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
        [JabatanApiSlice.reducerPath]: JabatanApiSlice.reducer,
        jenisKelamin: jenisKelaminReducer,
        person: personReducer,
        credential: authenticationReducer,
        [AuthenticationApiSlice.reducerPath]: AuthenticationApiSlice.reducer,
        authorization: authorizationReducer,
        [OtoritasApiSlice.reducerPath]: OtoritasApiSlice.reducer,
        simpleResponse: simpleResponseReducer,
        token: tokenReducer,
        [TokenApiSlice.reducerPath]: TokenApiSlice.reducer,
        [ModelPerizinanApiSlice.reducerPath]: ModelPerizinanApiSlice.reducer,
        [SkalaUsahaApiSlice.reducerPath]: SkalaUsahaApiSlice.reducer,      
        [KategoriPelakuUsahaApiSlice.reducerPath]: KategoriPelakuUsahaApiSlice.reducer,   
        [PelakuUsahaApiSlice.reducerPath]: PelakuUsahaApiSlice.reducer,
        perusahaan: perusahaanReducer,
        [RegisterPerusahaanApiSlice.reducerPath]: RegisterPerusahaanApiSlice.reducer,
        kategoriDokumen: kategoriDokumenReducer,
        [KategoriDokumenApiSlice.reducerPath]: KategoriDokumenApiSlice.reducer,
        dokumen: dokumenReducer,
        [DokumenApiSlice.reducerPath]: DokumenApiSlice.reducer,
        dokumenRegister: registerDokumenReducer,
        [RegisterDokumenApiSlice.reducerPath]: RegisterDokumenApiSlice.reducer,
        kbli: kbliReducer,
        [KbliApiSlice.reducerPath]: KbliApiSlice.reducer,
        registerKbli: registerKbliReducer,
        [RegisterKbliApiSlice.reducerPath]: RegisterKbliApiSlice.reducer,
        registerPerusahaan: registerPerusahaanReducer,
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
                                            .concat(ModelPerizinanApiSlice.middleware)
                                            .concat(SkalaUsahaApiSlice.middleware)
                                            .concat(KategoriPelakuUsahaApiSlice.middleware)
                                            .concat(PelakuUsahaApiSlice.middleware)
                                            .concat(RegisterPerusahaanApiSlice.middleware)
                                            .concat(KategoriDokumenApiSlice.middleware)
                                            .concat(DokumenApiSlice.middleware)
                                            .concat(RegisterDokumenApiSlice.middleware)
                                            .concat(KbliApiSlice.middleware)
                                            .concat(RegisterKbliApiSlice.middleware)
                                            .concat(RegisterPermohonanApiSlice.middleware)
                                            .concat(FlowLogApiSlice.middleware)
                                            .concat(StatusFlowLogApiSlice.middleware)
                                            .concat(KategoriFlowLogApiSlice.middleware)
                                            .concat(JenisPermohonanSuratArahanApiSlice.middleware)
                                            .concat(StatusWaliPermohonanApiSlice.middleware)
                                            .concat(JabatanApiSlice.middleware)
                                            .concat(PosisiTahapPemberkasanApiSlice.middleware)
                                            .concat(KategoriPermohonanApiSlice.middleware)
                                            .concat(sikolingApi.middleware)
                                            .concat(RegisterOtoritasPerusahaanApiSlice.middleware),
});

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
