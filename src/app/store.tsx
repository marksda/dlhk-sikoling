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
import pemrakarsaReducer from "../features/pemrakarsa/pemrakarsa-slice";
import jenisPelakuUsahaReducer from "../features/bentuk-usaha/jenis-pelaku-usaha-slice";
import { JenisPelakuUsahaApiSlice } from "../features/bentuk-usaha/jenis-pelaku-usaha-api-slice";
import authenticationReducer from "../features/security/authentication-slice";
import { AuthenticationApiSlice } from "../features/security/authentication-api-slice";
import authorizationReducer from "../features/security/authorization-slice";
import { AuthorizationApiSlice } from "../features/security/authorization-api-slice";
import tokenReducer from "../features/security/token-slice";

// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        jenisPelakuUsaha: jenisPelakuUsahaReducer,
        [JenisPelakuUsahaApiSlice.reducerPath]: JenisPelakuUsahaApiSlice.reducer,
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
        token: tokenReducer,
        pemrakarsa: pemrakarsaReducer,
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
                                            .concat(JenisPelakuUsahaApiSlice.middleware)
                                            .concat(BentukUsahaApiSlice.middleware)
                                            .concat(AuthenticationApiSlice.middleware)
                                            .concat(AuthorizationApiSlice.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
