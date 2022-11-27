import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IKategoriPelakuUsaha } from "./kategori-pelaku-usaha-slice";

export interface IPelakuUsaha {
    id: string|undefined;
    nama: string|undefined;
    singkatan: string|undefined;
    kategoriPelakuUsaha: IKategoriPelakuUsaha|undefined;
};

const initialState: IPelakuUsaha = {
    id: undefined,
    nama: undefined,
    singkatan: undefined,
    kategoriPelakuUsaha: undefined
};

export const pelakuUsahaSlice = createSlice({
    name: 'pelakuUsaha',
    initialState,
    reducers: {
        setPelakuUsaha: (state, action: PayloadAction<IPelakuUsaha>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.singkatan = action.payload.singkatan;
            state.kategoriPelakuUsaha = cloneDeep(action.payload.kategoriPelakuUsaha);
        },
        setIdPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setSingkatanPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.singkatan = action.payload;
        },
        setKategoriPelakuUsaha: (state, action: PayloadAction<IKategoriPelakuUsaha>) => {
            state.kategoriPelakuUsaha = cloneDeep(action.payload);
        },
    }
});

export const {
    setPelakuUsaha, setIdPelakuUsaha,
    setNamaPelakuUsaha, setSingkatanPelakuUsaha, setKategoriPelakuUsaha
} = pelakuUsahaSlice.actions;

export default pelakuUsahaSlice.reducer;