import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IJabatan } from "../jabatan/jabatan-slice";
import { IPerson } from "../person/person-slice";
import { IRegisterPerusahaan } from "../perusahaan/register-perusahaan-slice";

export interface IPegawai {
    id: string|null;
    perusahaan: Partial<IRegisterPerusahaan>|null;
    person: Partial<IPerson>|null;
    jabatan: Partial<IJabatan>|null;
};

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