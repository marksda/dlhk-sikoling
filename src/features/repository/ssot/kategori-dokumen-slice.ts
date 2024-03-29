import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKategoriDokumen } from "../../entity/kategori-dokumen";

const initialState: IKategoriDokumen = {
    id: null,
    nama: null,
    parent: null,
};

export const kategoriDokumenSlice = createSlice({
    name: 'KategoriDokumen',
    initialState,
    reducers: {
        setKategoriDokumen: (state, action: PayloadAction<IKategoriDokumen>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.parent = action.payload.parent;
        },
        setIdKategoriDokumen: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaKategoriDokumen: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setParentKategoriDokumen: (state, action: PayloadAction<string>) => {
            state.parent = action.payload;
        },
    }
});

export const { setKategoriDokumen, setIdKategoriDokumen, setNamaKategoriDokumen, setParentKategoriDokumen} = kategoriDokumenSlice.actions;

export default kategoriDokumenSlice.reducer;