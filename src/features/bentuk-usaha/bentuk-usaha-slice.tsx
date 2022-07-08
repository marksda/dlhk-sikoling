import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJenisPelakuUsaha } from "./jenis-pelaku-usaha-slice";

export interface IBentukUsaha {
    id: String|null;
    nama: string|null;
    singkatan: string|null;
    jenisPelakuUsaha: IJenisPelakuUsaha|null;
}

const initialState: IBentukUsaha = {
    id: null,
    nama: null,
    singkatan: null,
    jenisPelakuUsaha: {
        id: null,
        nama: null,
    }
}

const bentukUsahaSlice = createSlice({
    name: "bentukUsaha",
    initialState,
    reducers: {
        setBentukUsaha: (state, action: PayloadAction<IBentukUsaha>) => {
            state.id = action.payload.id;
            state.nama  = action.payload.nama;
            state.jenisPelakuUsaha = {
                id: action.payload.jenisPelakuUsaha!.id,
                nama: action.payload.jenisPelakuUsaha!.nama
            }
        },
        setIdBentukUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaBentukUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setJenisPelakuUsaha: (state, action: PayloadAction<IJenisPelakuUsaha>) => {
            state.jenisPelakuUsaha = {
                id: action.payload.id,
                nama: action.payload.nama,
            };
        },
    }
})

export const { setBentukUsaha, setIdBentukUsaha, setNamaBentukUsaha, setJenisPelakuUsaha } = bentukUsahaSlice.actions
export default bentukUsahaSlice.reducer