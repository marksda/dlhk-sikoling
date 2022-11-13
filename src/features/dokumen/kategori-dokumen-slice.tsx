import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IKategoriDokumen {
    id: string|undefined;
    nama: string|undefined;
    parent: string|undefined;
};

const initialState: IKategoriDokumen = {
    id: undefined,
    nama: undefined,
    parent: undefined,
};

export const kategoriDokumenSlice = createSlice({
    name: 'kategoriDokumen',
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