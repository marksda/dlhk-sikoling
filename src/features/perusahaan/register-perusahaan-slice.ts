import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IRegisterPerusahaan } from "../entity/register-perusahaan";
import { IPerson } from "../entity/person";
import { IPerusahaan } from "../entity/perusahaan";



const initialState: IRegisterPerusahaan = {
    id: null,
    tanggalRegistrasi: null,
    kreator: null,
    verifikator: null,
    perusahaan: null,
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
        setPerusahaanRegisterPerusahaan: (state, action: PayloadAction<IPerusahaan>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
    }
});

export const { 
    setIdRegisterPerusahaan, setRegisterPerusahaan, setPerusahaanRegisterPerusahaan,
} = registerPerusahaanSlice.actions;

export default registerPerusahaanSlice.reducer;

