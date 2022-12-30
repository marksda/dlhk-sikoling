import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IPerson } from "../person/person-slice";
import { IPerusahaan } from "../perusahaan/perusahaan-slice";
import { IDokumen } from "./dokumen-slice";

export interface IRegisterDokumen {
    dokumen: Pick<IDokumen, 'id'> & Partial<IDokumen>|null;
    perusahaan: Pick<IPerusahaan, 'id'> & Omit<IPerusahaan, 'id'>|null;
    lokasiFile: string|null;
    tanggalRegistrasi: string|null;
    uploader: Pick<IPerson, 'nik'>& Partial<IPerson>|null;
};

const initialState: IRegisterDokumen = {
    dokumen: null,
    perusahaan: null,
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
            state.perusahaan = cloneDeep(action.payload.perusahaan)
            state.lokasiFile = action.payload.lokasiFile;
            state.tanggalRegistrasi = action.payload.tanggalRegistrasi;
            state.uploader = cloneDeep(action.payload.uploader);
        },
        setDokumenRegisterDokumen: (state, action: PayloadAction<Pick<IDokumen, 'id'> & Partial<IDokumen>>) => {
            state.dokumen = cloneDeep(action.payload);
        },
        setPerusahaanRegisterDokumen: (state, action: PayloadAction<Pick<IPerusahaan, 'id'> & Omit<IPerusahaan, 'id'>>) => {
            state.perusahaan = cloneDeep(action.payload);
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