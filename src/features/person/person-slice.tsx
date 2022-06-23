import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAlamat } from "../alamat/alamat-slice";
import { IJenisKelamin } from "../jenis-kelamin/jenis-kelamin-slice";

export interface IPerson {
    nik?: string;
    nama?: string;
    jenisKelamin?: IJenisKelamin;
    alamat?: IAlamat;
    telepone?: string;
    scanKtp?: string;
}

const initialState: IPerson = {
    nik: undefined,
    nama: undefined,
    jenisKelamin: undefined,
    alamat: undefined,
    telepone: undefined,
    scanKtp: undefined,
}

export const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setNik: (state, action: PayloadAction<string>) => {
            state.nik = action.payload;
        },
        setNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setJenisKelamin: (state, action: PayloadAction<IJenisKelamin>) => {
            state.jenisKelamin = action.payload;
        },
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = action.payload;
        },
        setTelepone: (state, action: PayloadAction<string>) => {
            state.telepone = action.payload;
        },
        setScanKtp: (state, action: PayloadAction<string>) => {
            state.scanKtp = action.payload;
        },
    },
})

export const {setNik, setNama, setAlamat, setJenisKelamin, setTelepone, setScanKtp} = personSlice.actions
export default personSlice.reducer