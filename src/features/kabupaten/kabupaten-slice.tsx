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
        setKabupatenId: (state, action: PayloadAction<string>) => {
            state.id = action.payload
        },
        setKabupatenNama: (state, action: PayloadAction<string>) => {
            state.nama = action.payload
        },
        setKabupatenIdPropinsi: (state, action: PayloadAction<string>) => {
            state.idPropinsi = action.payload
        },
    },
}) 

// redux action creator
export const { setKabupaten, setKabupatenId: setId, setKabupatenNama: setNama, setKabupatenIdPropinsi: setIdPropinsi } = kabupatenSlice.actions

export default kabupatenSlice.reducer