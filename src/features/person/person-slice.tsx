import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAlamat } from "../alamat/alamat-slice";
import { IJenisKelamin } from "../jenis-kelamin/jenis-kelamin-slice";

interface IKontak {
    telepone?: string;
    fax?: string;
    email?: string;
}

export interface IPerson {
    nik: string;
    nama: string;
    jenisKelamin: IJenisKelamin;
    alamat: IAlamat;
    kontak: IKontak;
    scanKtp: string;
}

const initialState: IPerson = {} as IPerson

export const personSlice = createSlice({
    name: 'person',
    initialState,
    reducers: {
        setPerson: (state, action: PayloadAction<IPerson>) => {
            state.nik = action.payload.nik;
            state.nama = action.payload.nama;
            state.jenisKelamin = { 
                id: action.payload.jenisKelamin.id, 
                nama: action.payload.jenisKelamin.nama
            };
            state.alamat = {
                propinsi: {
                    id: action.payload.alamat.propinsi.id,
                    nama: action.payload.alamat.propinsi.nama
                },
                kabupaten: {
                    id: action.payload.alamat.kabupaten.id,
                    nama: action.payload.alamat.kabupaten.nama
                },
                kecamatan: {
                    id: action.payload.alamat.kecamatan.id,
                    nama: action.payload.alamat.kecamatan.nama
                },
                desa: {
                    id: action.payload.alamat.desa.id,
                    nama: action.payload.alamat.desa.nama
                },
                keterangan: action.payload.alamat.keterangan
            };
            state.kontak = {
                telepone: action.payload.kontak.telepone,
                email: action.payload.kontak.email
            };
            state.scanKtp = action.payload.scanKtp;
        },
        setNik: (state, action: PayloadAction<string>) => {
            state.nik = action.payload;
        },
        setNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setJenisKelamin: (state, action: PayloadAction<IJenisKelamin>) => {
            state.jenisKelamin = {
                id: action.payload.id,
                nama: action.payload.nama
            };
        },
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = {
                propinsi: {
                    id: action.payload.propinsi.id,
                    nama: action.payload.propinsi.nama
                },
                kabupaten: {
                    id: action.payload.kabupaten.id,
                    nama: action.payload.kabupaten.nama
                },
                kecamatan: {
                    id: action.payload.kecamatan.id,
                    nama: action.payload.kecamatan.nama
                },
                desa: {
                    id: action.payload.desa.id,
                    nama: action.payload.desa.nama
                },
                keterangan: action.payload.keterangan
            };
        },
        setKontak: (state, action: PayloadAction<IKontak>) => {
            state.kontak = {
                telepone: action.payload.telepone,
                email: action.payload.email
            };
        },
        setScanKtp: (state, action: PayloadAction<string>) => {
            state.scanKtp = action.payload;
        },
    },
})

export const {setPerson, setNik, setNama, setAlamat, setJenisKelamin, setKontak, setScanKtp} = personSlice.actions
export default personSlice.reducer