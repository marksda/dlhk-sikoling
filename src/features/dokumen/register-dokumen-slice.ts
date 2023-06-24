import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IDokumen } from "./dokumen-slice";
import { IStatusDokumen } from "./status-dokumen-slice";
import { IRegisterDokumen } from "../entity/register-dokumen";
import { IRegisterPerusahaan } from "../entity/register-perusahaan";
import { IOtoritas } from "../entity/otoritas";


const initialState: IRegisterDokumen = {
    id: null,
    dokumen: null,
    perusahaan: null,
    lokasiFile: null,
    statusDokumen: null,
    tanggalRegistrasi: null,
    uploader: null,
    statusVerified: null
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
        setPerusahaanRegisterDokumen: (state, action: PayloadAction<Pick<IRegisterPerusahaan, 'id'> & Omit<IRegisterPerusahaan, 'id'>>) => {
            state.perusahaan = cloneDeep(action.payload);
        },
        setStatusDokumenRegisterDokumen: (state, action: PayloadAction<Partial<IStatusDokumen>>) => {
            state.statusDokumen = cloneDeep(action.payload);
        },
        setLokasiFileRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.lokasiFile = cloneDeep(action.payload);
        },
        setTanggalRegistrasiRegisterDokumen: (state, action: PayloadAction<string>) => {
            state.tanggalRegistrasi = action.payload;
        },
        setUploaderRegisterDokumen: (state, action: PayloadAction<Partial<IOtoritas>>) => {
            state.uploader = cloneDeep(action.payload);
        },
    },
});

export const {
    setRegisterDokumen, setDokumenRegisterDokumen,
    setPerusahaanRegisterDokumen, setLokasiFileRegisterDokumen,
    setTanggalRegistrasiRegisterDokumen, setUploaderRegisterDokumen,
    setStatusDokumenRegisterDokumen,
} = registerDokumenSlice.actions;

export default registerDokumenSlice.reducer;