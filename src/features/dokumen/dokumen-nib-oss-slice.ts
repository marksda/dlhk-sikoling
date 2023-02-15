import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IDokumen } from "./dokumen-slice";
import { IRegisterKbli } from "./register-kbli-slice";

type daftarRegisterKbli = Partial<IRegisterKbli>[];

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
        setDokumenNibOss: (state, action: PayloadAction<IDokumenNibOss>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.nomor = action.payload.nomor;
            state.tanggal = action.payload.tanggal;
            state.daftarKbli = cloneDeep(action.payload.daftarKbli);
        },
        setIdDokumenNibOss: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumeNibOss: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setNomorDokumenNibOss: (state, action: PayloadAction<string>) => {
            state.nomor = action.payload;
        },
        setTanggalDokumenNibOss: (state, action: PayloadAction<string>) => {
            state.tanggal = action.payload;
        },        
        setDaftarKbliDokumenNibOss: (state, action: PayloadAction<daftarRegisterKbli>) => {
            state.daftarKbli = cloneDeep(action.payload);
        },
    }
});

export const { 
    setDokumenNibOss, setIdDokumenNibOss,
    setNamaDokumeNibOss, setNomorDokumenNibOss,
    setTanggalDokumenNibOss, setDaftarKbliDokumenNibOss
} = IDokumenNibOss.actions;
export default IDokumenNibOss.reducer;