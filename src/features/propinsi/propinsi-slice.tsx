import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPropinsiState {
    id: string;
    nama: string;
}

const initialState: IPropinsiState = {
    id: '',
    nama:'',
}

//redux busines logic
export const propinsiSlice = createSlice({
    name: 'propinsi',
    initialState,
    reducers: {
        setPropinsi: (state, action: PayloadAction<IPropinsiState>) => {
            state = action.payload
        },
    },
}) 

// redux action creator
export const { setPropinsi } = propinsiSlice.actions

export default propinsiSlice.reducer