import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IBentukUsaha {
    id: string|undefined;
    nama: string|undefined;
    singkatan: string|undefined;
}

const initialState: IBentukUsaha = {
    id: undefined,
    nama: undefined,
    singkatan: undefined,
}

const bentukUsahaSlice = createSlice({
    name: "bentukUsaha",
    initialState,
    reducers: {
        setBentukUsaha: (state, action: PayloadAction<IBentukUsaha>) => {
            state.id = action.payload.id;
            state.nama  = action.payload.nama;
        },
        setIdBentukUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaBentukUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    }
})

export const { setBentukUsaha, setIdBentukUsaha, setNamaBentukUsaha } = bentukUsahaSlice.actions
export default bentukUsahaSlice.reducer