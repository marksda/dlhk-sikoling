import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IDokumen } from "./dokumen-slice";
import { IKategoriDokumen } from "./kategori-dokumen-slice";
import { IKbli } from "./kbli-slice";

type daftarKbli = IKbli[];

export interface IDokumenOss extends IDokumen {
    nib: string|undefined;
    tanggalPenerbitan: string|undefined;
    daftarKbli: daftarKbli|undefined;
};

const initialState: IDokumenOss = {
    id: undefined,
    nama: undefined,
    kategori: undefined,
    nib: undefined,
    tanggalPenerbitan: undefined,
    daftarKbli: undefined,
};

export const dokumenOssSlice = createSlice({
    name: 'dokumenOss',
    initialState,
    reducers: {
        setDokumenOss: (state, action: PayloadAction<IDokumenOss>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.kategori = cloneDeep(action.payload.kategori);
        },
        setIdDokumenOss: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumenOss: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKategoriDokumenOss: (state, action: PayloadAction<Pick<IKategoriDokumen, 'id'> & Partial<IKategoriDokumen>>) => {
            state.kategori = cloneDeep(action.payload);
        },
        setNibDokumenOss: (state, action: PayloadAction<string>) => {
            state.nib = action.payload;
        },
        setTanggalPenerbitanDokumenOss: (state, action: PayloadAction<string>) => {
            state.tanggalPenerbitan = action.payload;
        },
        setDaftarKbliDokumenOss: (state, action: PayloadAction<daftarKbli>) => {
            state.daftarKbli = cloneDeep(action.payload);
        },
    }
});

export const { 
    setDokumenOss, setIdDokumenOss,
    setNamaDokumenOss, setKategoriDokumenOss,
    setNibDokumenOss, setTanggalPenerbitanDokumenOss, 
    setDaftarKbliDokumenOss
} = dokumenOssSlice.actions;
export default dokumenOssSlice.reducer;