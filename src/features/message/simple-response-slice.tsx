import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISimpleResponse {
    status: string;
    pesan: string;
}

const initialState: ISimpleResponse ={
    status: '',
    pesan: '',
};

//redux busines logic
export const SimpleResponseSlice = createSlice({
    name: 'simpleResponse',
    initialState,
    reducers: {
        setSimpleResponse: (state, action: PayloadAction<ISimpleResponse>) => {
            state.status = action.payload.status;
            state.pesan = action.payload.pesan;
        },
        setStatus: (state, action: PayloadAction<string>) => {
            state.status = action.payload;
        },
        setPesan: (state, action: PayloadAction<string>) => {
            state.pesan = action.payload;
        },
    },
}); 

// redux action creator
export const { setSimpleResponse, setStatus, setPesan } = SimpleResponseSlice.actions;

export default SimpleResponseSlice.reducer;