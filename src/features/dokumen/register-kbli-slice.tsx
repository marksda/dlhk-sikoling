import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRegisterKbli {
    nib: string|undefined;
    kode: string|undefined;
    nama: string|undefined;
};

const initialState: IRegisterKbli = {
    nib: undefined,
    kode: undefined,
    nama: undefined
};

export const registerKbliSlice = createSlice({
    name: 'registerKbli',
    initialState,
    reducers: {
        setRegisterKbli: (state, action: PayloadAction<IRegisterKbli>) => {
            state.kode = action.payload.kode;
            state.nama = action.payload.nama;
            state.nib = action.payload.nib;
        },
        setNibRegisterKbli: (state, action: PayloadAction<string>) => {
            state.nib = action.payload;
        },
        setKodeRegisterKbli: (state, action: PayloadAction<string>) => {
            state.kode = action.payload;
        },
        setNamaRegisterKbli: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    }
});

export const { setRegisterKbli,  setNibRegisterKbli, setKodeRegisterKbli, setNamaRegisterKbli} = registerKbliSlice.actions;
export default registerKbliSlice.reducer;