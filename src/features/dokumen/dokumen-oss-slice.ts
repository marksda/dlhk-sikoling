import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IDokumen } from "./dokumen-slice";
import { IRegisterKbli } from "./register-kbli-slice";

type daftarRegisterKbli = IRegisterKbli[];

export interface IDokumenNibOss extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
    daftarKbli: daftarRegisterKbli|null;
};

const initialState: IDokumenNibOss = {
    id: null,
    nama: null,
    kategoriDokumen: null,
    nomor: null,
    tanggal: null,
    daftarKbli: null,
};

export const IDokumenNibOss = createSlice({
    name: 'dokumenOss',
    initialState,
    reducers: {
        setDokumenOss: (state, action: PayloadAction<IDokumenOss>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.nomor = action.payload.nomor;
            state.tanggal = action.payload.tanggal;
            state.daftarKbli = cloneDeep(action.payload.daftarKbli);
        },
        setIdDokumenOss: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumenOss: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setNomorDokumenOss: (state, action: PayloadAction<string>) => {
            state.nomor = action.payload;
        },
        setTanggalDokumenOss: (state, action: PayloadAction<string>) => {
            state.tanggal = action.payload;
        },        
        setDaftarKbliDokumenOss: (state, action: PayloadAction<daftarRegisterKbli>) => {
            state.daftarKbli = cloneDeep(action.payload);
        },
    }
});

export const { 
    setDokumenOss, setIdDokumenOss,
    setNamaDokumenOss, setNomorDokumenOss,
    setTanggalDokumenOss, setDaftarKbliDokumenOss
} = IDokumenNibOss.actions;
export default IDokumenNibOss.reducer;