import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IJenisPelakuUsaha {
    id: String|null;
    nama: string|null;
};

const initialState: IJenisPelakuUsaha = {
    id: null,
    nama: null,
};

const jenisPelakuUsahaSlice = createSlice({
    name: 'jenisPelakuUsaha',
    initialState,
    reducers: {
        setJenisPelakuUsaha: (state, action: PayloadAction<IJenisPelakuUsaha>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setIdJenisPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaJenisPelakuUsaha: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
    }
});

export const { setJenisPelakuUsaha, setIdJenisPelakuUsaha, setNamaJenisPelakuUsaha } = jenisPelakuUsahaSlice.actions;
export default jenisPelakuUsahaSlice.reducer;