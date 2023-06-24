import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import cloneDeep from "lodash.clonedeep";
import { IPerson } from "../../entity/person";
import { IJenisKelamin } from "../../entity/jenis-kelamin";
import { IAlamat } from "../../entity/alamat";
import { IKontak } from "../../entity/kontak";

const initialState: IPerson = {
    nik: null,
    nama: null,
    jenisKelamin: null,
    alamat: null,
    kontak: null,
    scanKTP: null
} as IPerson

export const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setPerson: (state, action: PayloadAction<IPerson>) => {
            state.nik = action.payload.nik;
            state.nama = action.payload.nama;
            state.jenisKelamin = cloneDeep(action.payload.jenisKelamin);
            state.alamat = cloneDeep(action.payload.alamat);
            state.kontak = cloneDeep(action.payload.kontak);
            state.scanKTP = action.payload.scanKTP;
        },
        setNik: (state, action: PayloadAction<string>) => {
            state.nik = action.payload;
        },
        setNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setPersonJenisKelamin: (state, action: PayloadAction<IJenisKelamin>) => {
            state.jenisKelamin = cloneDeep(action.payload);
        },
        setPersonAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = cloneDeep(action.payload);
        },
        setPersonKontak: (state, action: PayloadAction<IKontak>) => {
            state.kontak = cloneDeep(action.payload);
        },
        setScanKtp: (state, action: PayloadAction<string>) => {
            state.scanKTP = action.payload;
        },
        resetPerson:(state) => {
            state.nik = null;
            state.nama = null;
            state.jenisKelamin = null;
            state.alamat = null;
            state.kontak = null;
            state.scanKTP = null;
        }
    },
});

export const {setPerson, setNik, setNama, setPersonAlamat, setPersonJenisKelamin, setPersonKontak, setScanKtp, resetPerson} = personSlice.actions;

export default personSlice.reducer;