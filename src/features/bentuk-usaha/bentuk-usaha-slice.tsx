import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IBentukUsaha {
    id: String;
    nama: string;
    singkatan: string;
    idJenisPelakuUsaha: string;
}

const initialState: IBentukUsaha = {
    id: '',
    nama: '',
    singkatan: '',
    idJenisPelakuUsaha: ''
}

const bentukUsahaSlice = createSlice({
    name: "bentukusaha",
    initialState,
    reducers: {
        setBentukUsaha: (state, action: PayloadAction<IBentukUsaha>) => {
            state = action.payload;
        },
        setIdBentukUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaBentukUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setIdJenisPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.idJenisPelakuUsaha = action.payload;
        },
    }
})