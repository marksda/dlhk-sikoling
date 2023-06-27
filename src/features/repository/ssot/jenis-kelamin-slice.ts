import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJenisKelamin } from "../../entity/jenis-kelamin";


const initialState: IJenisKelamin = {
    id: null,
    nama: null
};

export const jenisKelaminSlice = createSlice({
    name: 'jenisKelamin',
    initialState,
    reducers: {
        setJenisKelamin: (state, action: PayloadAction<IJenisKelamin>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setJenisKelaminId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setJenisKelaminNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    },
}) 

export const { setJenisKelamin, setJenisKelaminId, setJenisKelaminNama } = jenisKelaminSlice.actions

export default jenisKelaminSlice.reducer