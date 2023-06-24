import { configureStore } from "@reduxjs/toolkit";
import propinsiReducer from "../features/repository/ssot/propinsi-slice";
import { PropinsiApiSlice } from "../features/repository/service/propinsi-api-slice";
import kabupatenReducer from "../features/repository/ssot/kabupaten-slice";
import { KabupatenApiSlice } from "../features/repository/service/kabupaten-api-slice";
import kecamatanReducer from "../features/repository/ssot/kecamatan-slice";
import { KecamatanApiSlice } from "../features/repository/service/kecamatan-api-slice";
import desaReducer from "../features/repository/ssot/desa-slice";
import { DesaApiSlice } from "../features/repository/service/desa-api-slice";
import alamatReducer from "../features/repository/ssot/alamat-slice";
import jabatanReducer from "../features/repository/ssot/jabatan-slice";
import { JabatanApiSlice } from "../features/repository/service/jabatan-api-slice";
import jenisKelaminReducer from "../features/repository/ssot/jenis-kelamin-slice";
import { JenisKelaminApiSlice } from "../features/repository/service/jenis-kelamin-api-slice";
// import penanggungJawabReducer from "../features/penanggung-jawab/penanggung-jawab-slice";
import personReducer from "../features/repository/ssot/person-slice";
import { PersonApiSlice } from "../features/repository/service/person-api-slice";
import pegawaiReducer from "../features/repository/ssot/pegawai-slice";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import { AuthorizationApiSlice } from "../features/security/authorization-api-slice";
import tokenReducer from "../features/security/token-slice";
import { TokenApiSlice } from "../features/security/token-api-slice";
import simpleResponseReducer from "../features/message/simple-response-slice";
import { ModelPerizinanApiSlice } from "../features/repository/service/model-perizinan-api-slice"; 
import { SkalaUsahaApiSlice } from "../features/repository/service/skala-usaha-api-slice";
// import kategoriPelakuUsahaReducer from "../features/perusahaan/kategori-pelaku-usaha-slice";
import { KategoriPelakuUsahaApiSlice } from "../features/repository/service/kategori-pelaku-usaha-api-slice";
import { PelakuUsahaApiSlice } from "../features/repository/service/pelaku-usaha-api-slice";
// import perusahaanReducer from "../features/perusahaan/perusahaan-slice";
import perusahaanReducer from "../features/repository/ssot/perusahaan-slice";
import { RegisterPerusahaanApiSlice } from "../features/repository/service/register-perusahaan-api-slice";
import kategoriDokumenReducer from "../features/dokumen/kategori-dokumen-slice";
import { KategoriDokumenApiSlice } from "../features/dokumen/kategori-dokumen-api-slice";
import dokumenReducer from "../features/dokumen/dokumen-slice";
import { DokumenApiSlice } from "../features/dokumen/dokumen-api-slice";
import registerDokumenReducer from "../features/dokumen/register-dokumen-slice";
import { RegisterDokumenApiSlice } from "../features/dokumen/register-dokumen-api-slice";
import kbliReducer from "../features/dokumen/kbli-slice";
import { KbliApiSlice } from "../features/dokumen/kbli-api-slice";
import registerKbliReducer from "../features/dokumen/register-kbli-slice";
import { RegisterKbliApiSlice } from "../features/dokumen/register-kbli-api-slice";
import registerPerusahaanReducer from "../features/repository/ssot/register-perusahaan-slice";
import { KategoriPermohonanApiSlice } from "../features/permohonan/kategori-permohonan-api-slice";
import { RegisterPermohonanApiSlice } from "../features/permohonan/register-permohonan-api-slice";
import { JenisPermohonanSuratArahanApiSlice } from "../features/permohonan/jenis-permohonan-surat-arahan-api-slice";
import { FlowLogApiSlice } from "../features/log/flow-log-api-slice";
import { StatusFlowLogApiSlice } from "../features/log/status-flow-log-api-slice";
import { KategoriFlowLogApiSlice } from "../features/log/kategori-flow-log-api-slice";
import { StatusWaliPermohonanApiSlice } from "../features/permohonan/status-wali-api-slice";
import { PegawaiApiSlice } from "../features/repository/service/pegawai-api-slice";
import { PosisiTahapPemberkasanApiSlice } from "../features/permohonan/posisi-tahap-pemberkasan-api-slice";
import { HakAksesApiSlice } from "../features/repository/service/hak-akses-api-slice";
// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice";
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        propinsi: propinsiReducer,
        [PropinsiApiSlice.reducerPath]: PropinsiApiSlice.reducer,
        kabupaten: kabupatenReducer,
        [KabupatenApiSlice.reducerPath]: KabupatenApiSlice.reducer,
        kecamatan: kecamatanReducer,
        [KecamatanApiSlice.reducerPath]: KecamatanApiSlice.reducer,
        desa: desaReducer,
        [DesaApiSlice.reducerPath]: DesaApiSlice.reducer,
        alamat: alamatReducer,
        jabatan: jabatanReducer,
        [JabatanApiSlice.reducerPath]: JabatanApiSlice.reducer,
        jenisKelamin: jenisKelaminReducer,
        [JenisKelaminApiSlice.reducerPath]: JenisKelaminApiSlice.reducer,
        // penanggungJawab: penanggungJawabReducer,
        person: personReducer,
        [PersonApiSlice.reducerPath]: PersonApiSlice.reducer,
        pegawai: pegawaiReducer,
        credential: authenticationReducer,
        [AuthenticationApiSlice.reducerPath]: AuthenticationApiSlice.reducer,
        authorization: authorizationReducer,
        [AuthorizationApiSlice.reducerPath]: AuthorizationApiSlice.reducer,
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
        [PegawaiApiSlice.reducerPath]: PegawaiApiSlice.reducer,
        [FlowLogApiSlice.reducerPath]: FlowLogApiSlice.reducer,
        [StatusFlowLogApiSlice.reducerPath]: StatusFlowLogApiSlice.reducer,
        [KategoriFlowLogApiSlice.reducerPath]: KategoriFlowLogApiSlice.reducer,
        [HakAksesApiSlice.reducerPath]: HakAksesApiSlice.reducer,
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(PropinsiApiSlice.middleware)
                                            .concat(KabupatenApiSlice.middleware)
                                            .concat(KecamatanApiSlice.middleware)
                                            .concat(DesaApiSlice.middleware)
                                            .concat(JenisKelaminApiSlice.middleware)
                                            .concat(PersonApiSlice.middleware)
                                            .concat(AuthenticationApiSlice.middleware)
                                            .concat(AuthorizationApiSlice.middleware)
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
                                            .concat(PegawaiApiSlice.middleware)
                                            .concat(JabatanApiSlice.middleware)
                                            .concat(PosisiTahapPemberkasanApiSlice.middleware)
                                            .concat(HakAksesApiSlice.middleware)
                                            .concat(KategoriPermohonanApiSlice.middleware),
});

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
