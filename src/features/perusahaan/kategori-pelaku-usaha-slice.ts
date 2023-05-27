import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISkalaUsaha } from "./skala-usaha-api-slice";

export interface IKategoriPelakuUsaha {
    id: string|null;
    nama: string|null;
    skalaUsaha: Partial<ISkalaUsaha>|null;
};

const initialState: IKategoriPelakuUsaha = {
    id: null,
    nama: null,
    skalaUsaha: null
};

export const kategoriPelakuUsahaSlice = createSlice({
    name: 'kategoriPelakuUsaha',
    initialState,
    reducers: {
        setKategoriPelakuUsaha: (state, action: PayloadAction<IKategoriPelakuUsaha>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setIdKategoriPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaKategoriPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    }
});

export const {
    setKategoriPelakuUsaha, setIdKategoriPelakuUsaha, setNamaKategoriPelakuUsaha
} = kategoriPelakuUsahaSlice.actions;

export default kategoriPelakuUsahaSlice.reducer;