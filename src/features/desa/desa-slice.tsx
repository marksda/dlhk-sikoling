import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IDesa {
    id: string;
    nama: string;
    idKecamatan: string;
}

const initialState: IDesa = {
    id: '',
    nama:'',
    idKecamatan:'',
}

//redux busines logic
export const desaSlice = createSlice({
    name: 'desa',
    initialState,
    reducers: {
        setDesa: (state, action: PayloadAction<IDesa>) => {
            state = action.payload;
        },
        setDesaId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setDesaNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setDesaIdKecamatan: (state, action: PayloadAction<string>) => {
            state.idKecamatan = action.payload;
        },
    },
}) 

// redux action creator
export const { setDesa, setDesaId: setId, setDesaNama: setNama, setDesaIdKecamatan: setIdKecamatan } = desaSlice.actions

export default desaSlice.reducer