import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJabatan } from "../../entity/jabatan";


const initialState: IJabatan = {
    id: '',
    nama:'',
}

export const jabatanSlice = createSlice({
    name: 'jabatan',
    initialState,
    reducers: {
        setJabatan: (state, action: PayloadAction<IJabatan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setJabatanId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setJabatanNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    },
}) 

export const { setJabatan, setJabatanId, setJabatanNama } = jabatanSlice.actions

export default jabatanSlice.reducer