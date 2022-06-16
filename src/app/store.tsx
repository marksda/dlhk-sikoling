import { configureStore } from "@reduxjs/toolkit"
import bentukUsahaReducer from "../features/bentuk-usaha/bentuk-usaha-slice"
import propinsiReducer from "../features/propinsi/propinsi-slice"
// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
// import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        bentukUsaha: bentukUsahaReducer,
        propinsi: propinsiReducer,
        // kabupaten: kabupatenReducer,
        // kecamatan: kecamatanReducer,
        // desa: desaReducer
        login: loginReducer,
        // [loginApi.reducerPath]: loginApi.reducer,
    },
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware().concat(loginApi.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
