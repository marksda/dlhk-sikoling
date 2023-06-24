import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPenanggungJawab } from "../entity/penanggung-jawab";
import { IPerson } from "../entity/person";
import { IJabatan } from "../entity/jabatan";

const initialState: IPenanggungJawab = {
    id: null,
    person: null,
    jabatan: null,
    registerPerusahaan: null,
}

export const PenanggungJawabSlice = createSlice({
    name: 'penanggungJawab',
    initialState,
    reducers: {
        setPenanggungJawab: (state, action: PayloadAction<IPenanggungJawab>) => {
            state.id = action.payload.id;
            state.person = {
                nik: action.payload.person?.nik as string,
                nama: action.payload.person?.nama as string,
                jenisKelamin: { 
                    id: action.payload.person!.jenisKelamin!.id, 
                    nama: action.payload.person!.jenisKelamin!.nama,
                },
                alamat: {
                    propinsi: {
                        id: action.payload.person!.alamat!.propinsi!.id,
                        nama: action.payload.person!.alamat!.propinsi!.nama
                    },
                    kabupaten: {
                        id: action.payload.person!.alamat!.kabupaten!.id,
                        nama: action.payload.person!.alamat!.kabupaten!.nama
                    },
                    kecamatan: {
                        id: action.payload.person!.alamat!.kecamatan!.id,
                        nama: action.payload.person!.alamat!.kecamatan!.nama
                    },
                    desa: {
                        id: action.payload.person!.alamat!.desa!.id,
                        nama: action.payload.person!.alamat!.desa!.nama
                    },
                    keterangan: action.payload.person!.alamat!.keterangan
                },
                kontak: {
                    telepone: action.payload.person!.kontak!.telepone,
                    email: action.payload.person!.kontak!.email
                },
                scanKTP: action.payload.person?.scanKTP as string,
            };
            state.jabatan = {
                id: action.payload.jabatan?.id as string,
                nama: action.payload.jabatan?.nama as string
            }
        },
        setPenanggungJawabId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setPenanggungJawabPerson: (state, action: PayloadAction<IPerson>) => {
            state.person = {
                nik: action.payload.nik,
                nama: action.payload.nama as string,
                jenisKelamin: { 
                    id: action.payload.jenisKelamin!.id as string, 
                    nama: action.payload.jenisKelamin!.nama as string
                },
                alamat: {
                    propinsi: {
                        id: action.payload.alamat!.propinsi!.id,
                        nama: action.payload.alamat!.propinsi!.nama
                    },
                    kabupaten: {
                        id: action.payload.alamat!.kabupaten!.id,
                        nama: action.payload.alamat!.kabupaten!.nama
                    },
                    kecamatan: {
                        id: action.payload.alamat!.kecamatan!.id,
                        nama: action.payload.alamat!.kecamatan!.nama
                    },
                    desa: {
                        id: action.payload.alamat!.desa!.id,
                        nama: action.payload.alamat!.desa!.nama
                    },
                    keterangan: action.payload.alamat!.keterangan as string
                },
                kontak: {
                    telepone: action.payload.kontak!.telepone,
                    email: action.payload.kontak!.email
                },
                scanKTP: action.payload.scanKTP,
            };
        },
        setPenanggungJawabJabatan: (state, action: PayloadAction<IJabatan>) => {
            state.jabatan = {
                id: action.payload.id,
                nama: action.payload.nama
            }
        },
    },
}) 

export const { setPenanggungJawab, setPenanggungJawabId, setPenanggungJawabPerson, setPenanggungJawabJabatan } = PenanggungJawabSlice.actions

export default PenanggungJawabSlice.reducer