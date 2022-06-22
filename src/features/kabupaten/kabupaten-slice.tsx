import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IKabupaten {
    id: string;
    nama: string;
}

const initialState: IKabupaten = {
    id: '',
    nama:'',
}

//redux busines logic
export const kabupatenSlice = createSlice({
    name: 'kabupaten',
    initialState,
    reducers: {
        setKabupaten: (state, action: PayloadAction<IKabupaten>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setKabupatenId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setKabupatenNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    },
}) 

// redux action creator
export const { setKabupaten, setKabupatenId, setKabupatenNama } = kabupatenSlice.actions

export default kabupatenSlice.reducer