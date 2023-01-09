import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPerson } from "../person/person-slice";
import { IPerusahaan } from "./perusahaan-slice";

export interface IRegisterPerusahaan {
    id: string|null,
    tanggalRegistrasi: string|null;
    kreator: IPerson|null;
    verifikator: IPerson|null;
    perusahaan: IPerusahaan|null;
};

const initialState: IRegisterPerusahaan = {
    id: null,
    tanggalRegistrasi: null,
    kreator: null,
    verifikator: null,
    perusahaan: null
};

export const registerPerusahaanSlice = createSlice({
    name: 'registerPerusahaan',
    initialState,
    reducers: {
        setRegisterPerusahaan: (state, action: PayloadAction<IRegisterPerusahaan>) => {
            state.id = action.payload.id,
            state.tanggalRegistrasi = action.payload.tanggalRegistrasi;
            state.kreator = cloneDeep(action.payload.kreator);
            state.verifikator = cloneDeep(action.payload.verifikator);
            state.perusahaan = cloneDeep(action.payload.perusahaan);
        },
        setIdRegisterPerusahaan: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setKreatorRegisterPerusahaan: (state, action: PayloadAction<IPerson>) => {
            state.kreator = cloneDeep(action.payload);
        },
        setVerifikatorRegisterPerusahaan: (state, action: PayloadAction<IPerson>) => {
            state.verifikator = cloneDeep(action.payload);
        },
        setPerusahaanRegisterPerusahaan: (state, action: PayloadAction<IPerusahaan>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
    }
});

export const { 
    setIdRegisterPerusahaan, setRegisterPerusahaan, setKreatorRegisterPerusahaan, 
    setVerifikatorRegisterPerusahaan, setPerusahaanRegisterPerusahaan,
} = registerPerusahaanSlice.actions;

export default registerPerusahaanSlice.reducer;

