import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlamat } from "../alamat/alamat-slice";
import { IJabatan } from "../jabatan/jabatan-slice";
import { IJenisKelamin } from "../jenis-kelamin/jenis-kelamin-slice";

export interface IPenanggungJawab {
    id: string;
    nama: string;
    alamat: IAlamat;
    jabatan: IJabatan;
    jenisKelamin: IJenisKelamin;
    noIdentitas: string;
    noHandphone: string;
}

const initialState: IPenanggungJawab = {
    id: '',
    nama:'',
    alamat: {} as IAlamat,
    jabatan: {} as IJabatan,
    jenisKelamin: {} as IJenisKelamin,
    noIdentitas: '',
    noHandphone: ''
}

export const PenanggungJawabSlice = createSlice({
    name: 'penanggungJawab',
    initialState,
    reducers: {
        setPenanggungJawab: (state, action: PayloadAction<IPenanggungJawab>) => {
            state = action.payload
        },
        setPenanggungJawabId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setPenanggungJawabNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload
        },
        setPenanggungJawabAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = action.payload
        },
        setPenanggungJawabJabatan: (state, action: PayloadAction<IJabatan>) => {
            state.jabatan = action.payload
        },
        setPenanggungJawabJenisKelamin: (state, action: PayloadAction<IJenisKelamin>) => {
            state.jenisKelamin = action.payload
        },
        setPenanggungJawabNoIdentitas: (state, action: PayloadAction<string>) => {
            state.noIdentitas = action.payload
        },
        setPenanggungJawabNoHandphone: (state, action: PayloadAction<string>) => {
            state.noHandphone = action.payload
        },
    },
}) 

export const { setPenanggungJawab, setPenanggungJawabId: setId, setPenanggungJawabNama: setNama, setPenanggungJawabAlamat, setPenanggungJawabJabatan, setPenanggungJawabJenisKelamin, setPenanggungJawabNoIdentitas, setPenanggungJawabNoHandphone } = PenanggungJawabSlice.actions

export default PenanggungJawabSlice.reducer