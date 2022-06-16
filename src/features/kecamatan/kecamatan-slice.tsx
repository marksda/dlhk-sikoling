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
            state = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload
        },
        setIdKabupaten: (state, action: PayloadAction<string>) => {
            state.idKabupaten = action.payload
        },
    },
}) 

// redux action creator
export const { setKecamatan, setId, setNama, setIdKabupaten } = kecamatanSlice.actions

export default kecamatanSlice.reducer