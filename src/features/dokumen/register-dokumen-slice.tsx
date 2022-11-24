import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPerusahaan } from "../perusahaan/perusahaan-slice";
import { IDokumen } from "./dokumen-slice";
import { IKbli } from "./kbli-slice";

export interface IDetailDokumen {    
    dokumen: Pick<IDokumen, 'id'> & Partial<IDokumen> | undefined;
    lokasiFile: string | undefined;
};

export interface IDokumenOss extends IDetailDokumen {
    nib: string|undefined;
    tanggal: Date|undefined;
    daftarKbli: IKbli[]|undefined;
}

export interface IRegisterDokumen {
    id: string|undefined;
    perusahaan: Pick<IPerusahaan, 'id'> & Partial<IPerusahaan>|undefined;
    detailDokumen: Pick<IDetailDokumen, 'dokumen'>|undefined;
    tanggal: Date|undefined;
    isBerlaku: boolean|undefined;
};

const initialState: IRegisterDokumen = {
    id: undefined,
    perusahaan: undefined,
    detailDokumen: undefined,
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
            state.detailDokumen = cloneDeep(action.payload.detailDokumen!);
            state.tanggal = action.payload.tanggal;
            state.isBerlaku = action.payload.isBerlaku;
        },
        setIdRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setPerusahaanRegisterDokumen: (state, action: PayloadAction<Pick<IPerusahaan, 'id'> & Partial<IPerusahaan>>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
        setDokumenRegisterDokumen: (state, action: PayloadAction<IDetailDokumen>) => {
            state.detailDokumen = cloneDeep(action.payload);
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