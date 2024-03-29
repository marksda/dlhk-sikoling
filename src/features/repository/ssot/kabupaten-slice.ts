import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKabupaten } from "../../entity/kabupaten";

const initialState: IKabupaten = {
    id: null,
    nama: null,
    propinsi: null,
};

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
        resetKabupaten: (state) => {
            state.id = '';
            state.nama = '';
        },
    },
}) 

// redux action creator
export const { setKabupaten, setKabupatenId, setKabupatenNama, resetKabupaten } = kabupatenSlice.actions

export default kabupatenSlice.reducer