import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IJabatan {
    id: string;
    nama: string;
}

const initialState: IJabatan = {
    id: '',
    nama:'',
}

//redux busines logic
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

// redux action creator
export const { setJabatan, setJabatanId, setJabatanNama } = jabatanSlice.actions

export default jabatanSlice.reducer