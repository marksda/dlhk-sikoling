import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPegawai } from "../repository/ssot/pegawai-slice";
import { IDokumen } from "./dokumen-slice";

export interface IDokumenAktaPendirian extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
    namaNotaris: string|null;    
    penanggungJawab: Partial<IPegawai>|null;
}

const initialState: IDokumenAktaPendirian = {
    id: null,
    nama: null,
    kategoriDokumen: null,
    nomor: null,
    tanggal: null,
    namaNotaris: null,
    penanggungJawab: null,
};

export const DokumenAktaPendirian = createSlice({
    name: 'dokumenAktaPendirian',
    initialState,
    reducers: {
        setDokumenAktaPendirian: (state, action: PayloadAction<IDokumenAktaPendirian>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.kategoriDokumen = cloneDeep(action.payload.kategoriDokumen);
            state.nomor = action.payload.nomor;
            state.tanggal = action.payload.tanggal;
            state.namaNotaris = action.payload.namaNotaris;
            state.penanggungJawab = cloneDeep(action.payload.penanggungJawab);
        },
        setIdDokumenAktaPendirian: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumenAktaPendirian: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setNomorDokumenAktaPendirian: (state, action: PayloadAction<string>) => {
            state.nomor = action.payload;
        },
        setTanggalDokumenAktaPendirian: (state, action: PayloadAction<string>) => {
            state.tanggal = action.payload;
        },        
        setNamaNotarisDokumenAktaPendirian: (state, action: PayloadAction<string>) => {
            state.namaNotaris = action.payload;
        },
        setPenanggungJawabDokumenAktaPendirian: (state, action: PayloadAction<IPegawai>) => {
            state.penanggungJawab = cloneDeep(action.payload);
        },
    }
});

export const { 
    setDokumenAktaPendirian, setIdDokumenAktaPendirian,
    setNamaDokumenAktaPendirian, setNomorDokumenAktaPendirian,
    setTanggalDokumenAktaPendirian, setNamaNotarisDokumenAktaPendirian,
    setPenanggungJawabDokumenAktaPendirian
} = DokumenAktaPendirian.actions;

export default DokumenAktaPendirian.reducer;