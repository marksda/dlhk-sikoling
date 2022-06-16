import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IKecamatan {
    id: string;
    nama: string;
    idKabupaten: string;
}

const initialState: IKecamatan = {
    id: '',
    nama:'',
    idKabupaten:'',
}

//redux busines logic
export const kecamatanSlice = createSlice({
    name: 'kecamatan',
    initialState,
    reducers: {
        setKecamatan: (state, action: PayloadAction<IKecamatan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.idKabupaten = action.payload.idKabupaten;
        },
        setKecamatanId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setKecamatanNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKecamatanIdKabupaten: (state, action: PayloadAction<string>) => {
            state.idKabupaten = action.payload;
        },
    },
}) 

// redux action creator
export const { setKecamatan, setKecamatanId, setKecamatanNama, setKecamatanIdKabupaten } = kecamatanSlice.actions

export default kecamatanSlice.reducer