import { configureStore } from "@reduxjs/toolkit"
// import counterReducer from "../features/counter/counter-slice"
import loginReducer from "../features/login/login-slice"
import { loginApi } from "../services/sikoling-api"

export const store = configureStore({
    reducer: {
        login: loginReducer,
        [loginApi.reducerPath]: loginApi.reducer,
        // propinsi: propinsiReducer,
        // kabupaten: kabupatenReducer,
        // kecamatan: kecamatanReducer,
        // desa: desaReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(loginApi.middleware),
})

// Aliasing variable in typescript
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
