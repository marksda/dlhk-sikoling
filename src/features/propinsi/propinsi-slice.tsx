import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IPropinsi {
    key: string;
    text: string;
}

const initialState: IPropinsi = {
    key: '',
    text:'',
}

//redux busines logic
export const propinsiSlice = createSlice({
    name: 'propinsi',
    initialState,
    reducers: {
        setPropinsi: (state, action: PayloadAction<IPropinsi>) => {
            state.key = action.payload.key;
            state.text = action.payload.text;
        },
        setPropinsiId: (state, action: PayloadAction<string>) => {
            state.key = action.payload;
        },
        setPropinsiNama: (state, action: PayloadAction<string>) => {
            state.text = action.payload;
        },
    },
}) 

// redux action creator
export const { setPropinsi, setPropinsiId, setPropinsiNama } = propinsiSlice.actions

export default propinsiSlice.reducer