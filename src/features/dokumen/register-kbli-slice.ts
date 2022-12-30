import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IRegisterKbli {
    nib: string|undefined;
    kode: string|undefined;
};

const initialState: IRegisterKbli = {
    nib: undefined,
    kode: undefined,
};

export const registerKbliSlice = createSlice({
    name: 'registerKbli',
    initialState,
    reducers: {
        setRegisterKbli: (state, action: PayloadAction<IRegisterKbli>) => {
            state.kode = action.payload.kode;
            state.nib = action.payload.nib;
        },
        setNibRegisterKbli: (state, action: PayloadAction<string>) => {
            state.nib = action.payload;
        },
        setKodeRegisterKbli: (state, action: PayloadAction<string>) => {
            state.kode = action.payload;
        },
    }
});

export const { setRegisterKbli,  setNibRegisterKbli, setKodeRegisterKbli} = registerKbliSlice.actions;
export default registerKbliSlice.reducer;