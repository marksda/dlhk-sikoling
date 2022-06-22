import { configureStore } from "@reduxjs/toolkit"
import bentukUsahaReducer from "../features/bentuk-usaha/bentuk-usaha-slice"
import propinsiReducer from "../features/propinsi/propinsi-slice"
import { propinsiApiSlice } from "../features/propinsi/propinsi-api-slice"
import kabupatenReducer from "../features/kabupaten/kabupaten-slice"
import { KabupatenApiSlice } from "../features/kabupaten/kabupaten-api-slice"
import kecamatanReducer from "../features/kecamatan/kecamatan-slice"
import { KecamatanApiSlice } from "../features/kecamatan/kecamatan-api-slice"
import desaReducer from "../features/desa/desa-slice"
import { DesaApiSlice } from "../features/desa/desa-api-slice"
import alamatReducer from "../features/alamat/alamat-slice"
import jabatanReducer from "../features/jabatan/jabatan-slice"
import jenisKelaminReducer from "../features/jenis-kelamin/jenis-kelamin-slice"
import penanggungJawabReducer from "../features/penanggung-jawab/penanggung-jawab-slice"

// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        bentukUsaha: bentukUsahaReducer,
        propinsi: propinsiReducer,
        [propinsiApiSlice.reducerPath]: propinsiApiSlice.reducer,
        kabupaten: kabupatenReducer,
        [KabupatenApiSlice.reducerPath]: KabupatenApiSlice.reducer,
        kecamatan: kecamatanReducer,
        [KecamatanApiSlice.reducerPath]: KecamatanApiSlice.reducer,
        desa: desaReducer,
        [DesaApiSlice.reducerPath]: DesaApiSlice.reducer,
        alamat: alamatReducer,
        jabatan: jabatanReducer,
        jenisKelamin: jenisKelaminReducer,
        penanggungJawab: penanggungJawabReducer,
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(propinsiApiSlice.middleware)
                                            .concat(KabupatenApiSlice.middleware)
                                            .concat(KecamatanApiSlice.middleware)
                                            .concat(DesaApiSlice.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
