import { configureStore } from "@reduxjs/toolkit";
import bentukUsahaReducer from "../features/bentuk-usaha/bentuk-usaha-slice";
import { BentukUsahaApiSlice } from "../features/bentuk-usaha/bentuk-usaha-api-slice";
import propinsiReducer from "../features/propinsi/propinsi-slice";
import { PropinsiApiSlice } from "../features/propinsi/propinsi-api-slice";
import kabupatenReducer from "../features/kabupaten/kabupaten-slice";
import { KabupatenApiSlice } from "../features/kabupaten/kabupaten-api-slice";
import kecamatanReducer from "../features/kecamatan/kecamatan-slice";
import { KecamatanApiSlice } from "../features/kecamatan/kecamatan-api-slice";
import desaReducer from "../features/desa/desa-slice";
import { DesaApiSlice } from "../features/desa/desa-api-slice";
import alamatReducer from "../features/alamat/alamat-slice";
import jabatanReducer from "../features/jabatan/jabatan-slice";
import jenisKelaminReducer from "../features/jenis-kelamin/jenis-kelamin-slice";
import { JenisKelaminApiSlice } from "../features/jenis-kelamin/jenis-kelamin-api-slice";
import penanggungJawabReducer from "../features/penanggung-jawab/penanggung-jawab-slice";
import personReducer from "../features/person/person-slice";
import { PersonApiSlice } from "../features/person/person-api-slice";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import { AuthorizationApiSlice } from "../features/security/authorization-api-slice";
import tokenReducer from "../features/security/token-slice";
import simpleResponseReducer from "../features/message/simple-response-slice";
import { ModelPerizinanApiSlice } from "../features/perusahaan/model-perizinan-api-slice"; 
import { SkalaUsahaApiSlice } from "../features/perusahaan/skala-usaha";
import { PelakuUsahaApiSlice } from "../features/perusahaan/pelaku-usaha-api-slice";
import perusahaanReducer from "../features/perusahaan/perusahaan-slice";
import { PerusahaanApiSlice } from "../features/perusahaan/perusahaan-api-slice";
import kategoriDokumenReducer from "../features/dokumen/kategori-dokumen-slice";
import { KategoriDokumenApiSlice } from "../features/dokumen/kategori-dokumen-api-slice";
import dokumenReducer from "../features/dokumen/dokumen-slice";
import { DokumenApiSlice } from "../features/dokumen/dokumen-api-slice";
import registerDokumenReducer from "../features/dokumen/register-dokumen-slice";
import kbliReducer from "../features/dokumen/kbli-slice";
import { KbliApiSlice } from "../features/dokumen/kbli-api-slice";
import registerKbliReducer from "../features/dokumen/register-kbli-slice";

// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        bentukUsaha: bentukUsahaReducer,
        [BentukUsahaApiSlice.reducerPath]: BentukUsahaApiSlice.reducer,
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
        jenisKelamin: jenisKelaminReducer,
        [JenisKelaminApiSlice.reducerPath]: JenisKelaminApiSlice.reducer,
        penanggungJawab: penanggungJawabReducer,
        person: personReducer,
        [PersonApiSlice.reducerPath]: PersonApiSlice.reducer,
        authentication: authenticationReducer,
        [AuthenticationApiSlice.reducerPath]: AuthenticationApiSlice.reducer,
        authorization: authorizationReducer,
        [AuthorizationApiSlice.reducerPath]: AuthorizationApiSlice.reducer,
        simpleResponse: simpleResponseReducer,
        token: tokenReducer,
        [ModelPerizinanApiSlice.reducerPath]: ModelPerizinanApiSlice.reducer,
        [SkalaUsahaApiSlice.reducerPath]: SkalaUsahaApiSlice.reducer, 
        [PelakuUsahaApiSlice.reducerPath]: PelakuUsahaApiSlice.reducer,
        perusahaan: perusahaanReducer,
        [PerusahaanApiSlice.reducerPath]: PerusahaanApiSlice.reducer,
        kategoriDokumen: kategoriDokumenReducer,
        [KategoriDokumenApiSlice.reducerPath]: KategoriDokumenApiSlice.reducer,
        dokumen: dokumenReducer,
        [DokumenApiSlice.reducerPath]: DokumenApiSlice.reducer,
        dokumenRegister: registerDokumenReducer,
        kbli: kbliReducer,
        [KbliApiSlice.reducerPath]: KbliApiSlice.reducer,
        registerKbli: registerKbliReducer,
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
                                            .concat(BentukUsahaApiSlice.middleware)
                                            .concat(AuthenticationApiSlice.middleware)
                                            .concat(AuthorizationApiSlice.middleware)
                                            .concat(ModelPerizinanApiSlice.middleware)
                                            .concat(SkalaUsahaApiSlice.middleware)
                                            .concat(PelakuUsahaApiSlice.middleware)
                                            .concat(PerusahaanApiSlice.middleware)
                                            .concat(KategoriDokumenApiSlice.middleware)
                                            .concat(DokumenApiSlice.middleware)
                                            .concat(KbliApiSlice.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
