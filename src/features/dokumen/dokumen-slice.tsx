import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IKategoriDokumen } from "./kategori-dokumen-slice";

export interface IDokumen {
    id: string|undefined;
    nama: string|undefined;
    kategoriDokumen: Pick<IKategoriDokumen, 'id'> & Partial<IKategoriDokumen> | undefined;
    detailDokumen: any|undefined;
};

const initialState: IDokumen = {
    id: undefined,
    nama: undefined,
    kategoriDokumen: undefined,
    detailDokumen: undefined,
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
        setKategoriDokumen: (state, action: PayloadAction<Pick<IKategoriDokumen, 'id'> & Partial<IKategoriDokumen>>) => {
            state.kategoriDokumen = cloneDeep(action.payload);
        },
    },
});

export const { setDokumen,setIdDokumen, setNamaDokumen, setKategoriDokumen } = dokumenSlice.actions;
export default dokumenSlice.reducer;