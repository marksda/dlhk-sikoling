import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPerson } from "../person/person-slice";
import { IPerusahaan } from "../perusahaan/perusahaan-slice";
import { IRegisterPerusahaan } from "../perusahaan/register-perusahaan-slice";
import { IDokumenNibOss } from "./dokumen-nib-oss-slice";
import { IDokumen } from "./dokumen-slice";

export interface IRegisterDokumen {
    id: string|null;
    dokumen: (Pick<IDokumenNibOss, 'id'> & Partial<IDokumenNibOss>)|null;
    registerPerusahaan: (Pick<IRegisterPerusahaan, 'id'> & Omit<IRegisterPerusahaan, 'id'>)|null;
    lokasiFile: string|null;
    tanggalRegistrasi: string|null;
    uploader: (Pick<IPerson, 'nik'>& Partial<IPerson>)|null;
};

const initialState: IRegisterDokumen = {
    id: null,
    dokumen: null,
    registerPerusahaan: null,
    lokasiFile: null,
    tanggalRegistrasi: null,
    uploader: null
};

export const registerDokumenSlice = createSlice({
    name: 'registerDokumen',
    initialState,
    reducers: {
        setRegisterDokumen: (state, action: PayloadAction<IRegisterDokumen>) => {
            state.dokumen = cloneDeep(action.payload.dokumen);
            state.registerPerusahaan = cloneDeep(action.payload.registerPerusahaan)
            state.lokasiFile = action.payload.lokasiFile;
            state.tanggalRegistrasi = action.payload.tanggalRegistrasi;
            state.uploader = cloneDeep(action.payload.uploader);
        },
        setDokumenRegisterDokumen: (state, action: PayloadAction<Pick<IDokumen, 'id'> & Partial<IDokumen>>) => {
            state.dokumen = cloneDeep(action.payload);
        },
        setPerusahaanRegisterDokumen: (state, action: PayloadAction<Pick<IRegisterPerusahaan, 'id'> & Omit<IRegisterPerusahaan, 'id'>>) => {
            state.registerPerusahaan = cloneDeep(action.payload);
        },
        setLokasiFileRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.lokasiFile = cloneDeep(action.payload);
        },
        setTanggalRegistrasiRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.tanggalRegistrasi = action.payload;
        },
        setUploaderRegisterDokumen: (state, action: PayloadAction<Pick<IPerson, 'nik'>& Partial<IPerson>>) => {
            state.uploader = cloneDeep(action.payload);
        },
    },
});

export const {
    setRegisterDokumen, setDokumenRegisterDokumen,
    setPerusahaanRegisterDokumen, setLokasiFileRegisterDokumen,
    setTanggalRegistrasiRegisterDokumen, setUploaderRegisterDokumen
} = registerDokumenSlice.actions;

export default registerDokumenSlice.reducer;