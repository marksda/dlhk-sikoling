import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPerusahaan } from "../perusahaan/perusahaan-slice";
import { IDokumen } from "./dokumen-slice";

export interface IRegisterDokumen {
    id: string|undefined;
    perusahaan: Pick<IPerusahaan, 'id'> & Partial<IPerusahaan>|undefined;
    dokumen: Pick<IDokumen, 'id'> & Partial<IDokumen>|undefined;
    tanggal: Date|undefined;
    isBerlaku: boolean|undefined;
};

const initialState: IRegisterDokumen = {
    id: undefined,
    perusahaan: undefined,
    dokumen: undefined,
    tanggal: undefined,
    isBerlaku: undefined
};

export const registerDokumenSlice = createSlice({
    name: 'registerDokumen',
    initialState,
    reducers: {
        setRegisterDokumen: (state, action: PayloadAction<IRegisterDokumen>) => {
            state.id = action.payload.id;
            state.perusahaan = cloneDeep(action.payload.perusahaan!)
            state.dokumen = cloneDeep(action.payload.dokumen!);
            state.tanggal = action.payload.tanggal;
            state.isBerlaku = action.payload.isBerlaku;
        },
        setIdRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setPerusahaanRegisterDokumen: (state, action: PayloadAction<Pick<IPerusahaan, 'id'> & Partial<IPerusahaan>>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
        setDokumenRegisterDokumen: (state, action: PayloadAction<Pick<IDokumen, 'id'> & Partial<IDokumen>>) => {
            state.dokumen = cloneDeep(action.payload);
        },
        setTanggalRegisterDokumen: (state, action: PayloadAction<Date>) => {
            state.tanggal = action.payload;
        },
        setIsBerlakuRegisterDokumen: (state, action: PayloadAction<boolean>) => {
            state.isBerlaku = action.payload;
        },
    },
});

export const {
    setRegisterDokumen, setIdRegisterDokumen,
    setPerusahaanRegisterDokumen, setDokumenRegisterDokumen,
    setTanggalRegisterDokumen, setIsBerlakuRegisterDokumen
} = registerDokumenSlice.actions;

export default registerDokumenSlice.reducer;