import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKategoriDokumen } from "./kategori-dokumen-slice";

export interface IDokumen {
    id: string|undefined;
    nama: string|undefined;
    kategoriDokumen: IKategoriDokumen|undefined;
};

const initialState: IDokumen = {
    id: undefined,
    nama: undefined,
    kategoriDokumen: undefined,
};

export const dokumenSlice = createSlice({
    name: 'dokumen',
    initialState,
    reducers: {
        setDokumen: (state, action: PayloadAction<IDokumen>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.kategoriDokumen = {
                id: action.payload.kategoriDokumen?.id,
                nama: action.payload.kategoriDokumen?.nama,
                parent: action.payload.kategoriDokumen?.parent
            };
        },
        setIdDokumen: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaDokumen: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setKategoriDokumen: (state, action: PayloadAction<IKategoriDokumen>) => {
            state.kategoriDokumen = {
                id: action.payload.id,
                nama: action.payload.nama,
                parent: action.payload.parent
            };
        },
    },
});

export const { setDokumen,setIdDokumen, setNamaDokumen, setKategoriDokumen } = dokumenSlice.actions;
export default dokumenSlice.reducer;