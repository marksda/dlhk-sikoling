import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IJenisKelamin {
    id: string;
    nama: string;
}

const initialState: IJenisKelamin = {
    id: '',
    nama:'',
}

//redux busines logic
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

// redux action creator
export const { setJenisKelamin, setJenisKelaminId, setJenisKelaminNama } = jenisKelaminSlice.actions

export default jenisKelaminSlice.reducer