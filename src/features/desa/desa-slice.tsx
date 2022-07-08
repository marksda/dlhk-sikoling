import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultDesa } from "../config/config";

export interface IDesa {
    id: string|null;
    nama: string|null;
}

const initialState: IDesa = defaultDesa;

export const desaSlice = createSlice({
    name: 'desa',
    initialState,
    reducers: {
        setDesa: (state, action: PayloadAction<IDesa>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setDesaId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setDesaNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        resetDesa: (state) => {
            state.id = '';
            state.nama = '';
        }
    },
}) 

export const { setDesa, setDesaId, setDesaNama, resetDesa } = desaSlice.actions

export default desaSlice.reducer