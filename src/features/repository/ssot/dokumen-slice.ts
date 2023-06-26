import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IKategoriDokumen } from "./kategori-dokumen-slice";
import { IDokumen } from "../../entity/dokumen";


const initialState: IDokumen = {
    id: null,
    nama: null,
    kategoriDokumen: null
};

export const dokumenSlice = createSlice({
    name: 'dokumen',
    initialState,
    reducers: {
        setDokumen: (state, action: PayloadAction<IDokumen>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.kategoriDokumen = cloneDeep(action.payload.kategoriDokumen);
        },
        setIdDokumen: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumen: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKategoriDokumen: (state, action: PayloadAction<Pick<IKategoriDokumen, 'id'> & Partial<IKategoriDokumen>>) => {
            state.kategoriDokumen = cloneDeep(action.payload);
        }
    },
});

export const { 
    setDokumen, setIdDokumen, setNamaDokumen, 
    setKategoriDokumen 
} = dokumenSlice.actions;

export default dokumenSlice.reducer;