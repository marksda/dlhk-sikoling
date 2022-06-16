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
            state = action.payload
        },
        setId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload
        },
        setIdPropinsi: (state, action: PayloadAction<string>) => {
            state.idPropinsi = action.payload
        },
    },
}) 

// redux action creator
export const { setKabupaten, setId, setNama, setIdPropinsi } = kabupatenSlice.actions

export default kabupatenSlice.reducer