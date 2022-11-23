import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface IKbli {
    kode: string|undefined;
    nama: string|undefined;
    kategori: string|undefined;
};

const initialState: IKbli = {
    kode: undefined,
    nama: undefined,
    kategori: undefined
};

export const kbliSlice = createSlice({
    name: 'kbli',
    initialState,
    reducers: {
        setKbli: (state, action: PayloadAction<IKbli>) => {
            state.kode = action.payload.kode;
            state.nama = action.payload.nama;
            state.kategori = action.payload.kategori
        },
        setKodeKbli: (state, action: PayloadAction<string>) => {
            state.kode = action.payload;
        },
        setNamaKbli: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKategoriKbli: (state, action: PayloadAction<string>) => {
            state.kategori = action.payload;
        },
    }
});

export const { setKbli, setKodeKbli, setNamaKbli, setKategoriKbli } = kbliSlice.actions;
export default kbliSlice.reducer;