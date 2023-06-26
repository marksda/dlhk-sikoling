import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IDokumenNibOss } from "../../entity/dokumen-nib-oss";
import { IRegisterKbli } from "../../entity/register-kbli";


const initialState: IDokumenNibOss = {
    id: null,
    nama: null,
    kategoriDokumen: null,
    nomor: null,
    tanggal: null,
    daftarRegisterKbli: null,
};

export const DokumenNibOss = createSlice({
    name: 'dokumenNibOss',
    initialState,
    reducers: {
        setDokumenNibOss: (state, action: PayloadAction<IDokumenNibOss>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.kategoriDokumen = cloneDeep(action.payload.kategoriDokumen);
            state.nomor = action.payload.nomor;
            state.tanggal = action.payload.tanggal;
            state.daftarRegisterKbli = cloneDeep(action.payload.daftarRegisterKbli);
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
        setDaftarKbliDokumenNibOss: (state, action: PayloadAction<IRegisterKbli[]>) => {
            state.daftarRegisterKbli = cloneDeep(action.payload);
        },
    }
});

export const { 
    setDokumenNibOss, setIdDokumenNibOss,
    setNamaDokumeNibOss, setNomorDokumenNibOss,
    setTanggalDokumenNibOss, setDaftarKbliDokumenNibOss
} = DokumenNibOss.actions;

export default DokumenNibOss.reducer;