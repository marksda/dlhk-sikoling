import { configureStore } from "@reduxjs/toolkit"
import bentukUsahaReducer from "../features/bentuk-usaha/bentuk-usaha-slice"
import propinsiReducer from "../features/propinsi/propinsi-slice"
import { propinsiApiSlice } from "../features/propinsi/propinsi-api-slice"
import { kabupatenSlice } from "../features/kabupaten/kabupaten-slice"
import kabupatenReducer from "../features/kabupaten/kabupaten-slice"
import kecamatanReducer from "../features/kecamatan/kecamatan-slice"
import desaReducer from "../features/desa/desa-slice"
import alamatReducer from "../features/alamat/alamat-slice"
import jabatanReducer from "../features/jabatan/jabatan-slice"
import jenisKelaminReducer from "../features/jenis-kelamin/jenis-kelamin-slice"
import penanggungJawabReducer from "../features/penanggung-jawab/penanggung-jawab-slice"

// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
import { KabupatenApiSlice } from "../features/kabupaten/kabupaten-api-slice"
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        bentukUsaha: bentukUsahaReducer,
        propinsi: propinsiReducer,
        [propinsiApiSlice.reducerPath]: propinsiApiSlice.reducer,
        kabupaten: kabupatenReducer,
        [KabupatenApiSlice.reducerPath]: KabupatenApiSlice.reducer,
        kecamatan: kecamatanReducer,
        desa: desaReducer,
        alamat: alamatReducer,
        jabatan: jabatanReducer,
        jenisKelamin: jenisKelaminReducer,
        penanggungJawab: penanggungJawabReducer,
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
                                            .concat(propinsiApiSlice.middleware)
                                            .concat(KabupatenApiSlice.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
