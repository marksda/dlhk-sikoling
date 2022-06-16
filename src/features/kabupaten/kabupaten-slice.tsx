import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IKabupaten {
    id: string;
    nama: string;
    idPropinsi: string;
}

const initialState: IKabupaten = {
    id: '',
    nama:'',
    idPropinsi:'',
}

//redux busines logic
export const kabupatenSlice = createSlice({
    name: 'kabupaten',
    initialState,
    reducers: {
        setKabupaten: (state, action: PayloadAction<IKabupaten>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.idPropinsi = action.payload.idPropinsi;
        },
        setKabupatenId: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setKabupatenNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKabupatenIdPropinsi: (state, action: PayloadAction<string>) => {
            state.idPropinsi = action.payload;
        },
    },
}) 

// redux action creator
export const { setKabupaten, setKabupatenId, setKabupatenNama, setKabupatenIdPropinsi } = kabupatenSlice.actions

export default kabupatenSlice.reducer