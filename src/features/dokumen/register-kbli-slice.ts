import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRegisterKbli {
    idNib: string|null;
    idKbli: string|null;
    nama: string|null;
};

const initialState: IRegisterKbli = {
    idNib: null,
    idKbli: null,
    nama: null
};

export const registerKbliSlice = createSlice({
    name: 'registerKbli',
    initialState,
    reducers: {
        setRegisterKbli: (state, action: PayloadAction<IRegisterKbli>) => {
            state.idNib = action.payload.idNib;
            state.idKbli = action.payload.idKbli;
            state.nama = action.payload.nama;
        },
        setNibRegisterKbli: (state, action: PayloadAction<string>) => {
            state.idNib = action.payload;
        },
        setKodeRegisterKbli: (state, action: PayloadAction<string>) => {
            state.idKbli = action.payload;
        },
        setNamaRegisterKbli: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    }
});

export const { setRegisterKbli,  setNibRegisterKbli, setKodeRegisterKbli, setNamaRegisterKbli} = registerKbliSlice.actions;
export default registerKbliSlice.reducer;