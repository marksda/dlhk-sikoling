import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPegawai } from "../../entity/pegawai";
import { IRegisterPerusahaan } from "../../entity/register-perusahaan";
import { IPerson } from "../../entity/person";
import { IJabatan } from "../../entity/jabatan";



const initialState: IPegawai = {
    id: null,
    perusahaan: null,
    person: null,
    jabatan: null,
};

export const pegawaiSlice = createSlice({
    name: 'pegawai',
    initialState,
    reducers: {
        setPegawai: (state, action: PayloadAction<IPegawai>) => {
            state.id = action.payload.id;
            state.perusahaan = cloneDeep(action.payload.perusahaan);
            state.person = cloneDeep(action.payload.person);
            state.jabatan = cloneDeep(action.payload.jabatan);
        },
        setPerusahaanPegawai: (state, action: PayloadAction<IRegisterPerusahaan>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
        setPersonPegawai: (state, action: PayloadAction<IPerson>) => {
            state.person = cloneDeep(action.payload);
        },
        setJabatanPegawai: (state, action: PayloadAction<IJabatan>) => {
            state.jabatan = cloneDeep(action.payload);
        },
    }
});

export const { setPegawai, setPerusahaanPegawai, setPersonPegawai, setJabatanPegawai} = pegawaiSlice.actions;

export default pegawaiSlice.reducer;