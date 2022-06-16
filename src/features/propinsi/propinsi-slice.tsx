import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPropinsi {
    id: string;
    nama: string;
}

const initialState: IPropinsi = {
    id: '',
    nama:'',
}

//redux busines logic
export const propinsiSlice = createSlice({
    name: 'propinsi',
    initialState,
    reducers: {
        setPropinsi: (state, action: PayloadAction<IPropinsi>) => {
            state = action.payload
        },
        setPropinsiId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setPropinsiNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload
        },
    },
}) 

// redux action creator
export const { setPropinsi, setPropinsiId, setPropinsiNama } = propinsiSlice.actions

export default propinsiSlice.reducer