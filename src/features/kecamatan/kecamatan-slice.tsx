import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultKecamatan } from "../config/config";

export interface IKecamatan {
    id: string|null;
    nama: string|null;
}

const initialState: IKecamatan = defaultKecamatan;

export const kecamatanSlice = createSlice({
    name: 'kecamatan',
    initialState,
    reducers: {
        setKecamatan: (state, action: PayloadAction<IKecamatan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setKecamatanId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setKecamatanNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        resetKecamatan: (state) => {
            state.id = '';
            state.nama = '';
        }
    },
}) 

export const { setKecamatan, setKecamatanId, setKecamatanNama, resetKecamatan } = kecamatanSlice.actions

export default kecamatanSlice.reducer