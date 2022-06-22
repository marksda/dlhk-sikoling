import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { defaultDesa } from "../config/config";

export interface IDesa {
    id: string;
    nama: string;
}

const initialState: IDesa = defaultDesa;

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
        resetDesa: (state) => {
            state.id = "";
            state.nama = "";
        }
    },
}) 

// redux action creator
export const { setDesa, setDesaId, setDesaNama, resetDesa } = desaSlice.actions

export default desaSlice.reducer