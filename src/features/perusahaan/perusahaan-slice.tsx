import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cloneDeep from "lodash.clonedeep";
import { IAlamat } from "../alamat/alamat-slice";
import { IKontak } from "../person/person-slice";
import { IModelPerizinan } from "./model-perizinan-api-slice";
import { IPelakuUsaha } from "./pelaku-usaha-slice";
import { ISkalaUsaha } from "./skala-usaha-api-slice";

type IDaftarRegisterDokumen = any[];

export interface IPerusahaan {
    id: string|null;
    nama: string|null;
    modelPerizinan: Pick<IModelPerizinan, 'id'> & Partial<IModelPerizinan> | null;
    skalaUsaha: Pick<ISkalaUsaha, 'id'> & Partial<ISkalaUsaha> | null;
    pelakuUsaha: Pick<IPelakuUsaha, 'id'> & Partial<IPelakuUsaha> | null;
    alamat: IAlamat|null;
    kontak: IKontak|null;
    daftarRegisterDokumen: IDaftarRegisterDokumen|null;
};

const initialState: IPerusahaan = {
    id: null,
    nama: null,
    modelPerizinan: null,
    skalaUsaha: null,
    pelakuUsaha: null,
    alamat: null,
    kontak: null,
    daftarRegisterDokumen: null,
}

export const perusahaanSlice = createSlice({
    name: 'perusahaan',
    initialState,
    reducers: {
        setPerusahaan: (state, action: PayloadAction<IPerusahaan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
            state.modelPerizinan = cloneDeep(action.payload.modelPerizinan);
            state.skalaUsaha = cloneDeep(action.payload.skalaUsaha);
            state.pelakuUsaha = cloneDeep(action.payload.pelakuUsaha);
            state.alamat = cloneDeep(action.payload.alamat);
            state.kontak = cloneDeep(action.payload.kontak);
            state.daftarRegisterDokumen = cloneDeep(action.payload.daftarRegisterDokumen);
        },
        setIdPerusahaan: (state, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setNamaPerusahaan: (state, action: PayloadAction<string>) => {
            state.nama = action.payload;
        },
        setModelPerizinanPerusahaan: (state, action: PayloadAction<Pick<IModelPerizinan, 'id'> & Partial<IModelPerizinan>>) => {
            state.modelPerizinan = cloneDeep(action.payload);
        },
        setSkalaUsahaPerusahaan: (state, action: PayloadAction<Pick<ISkalaUsaha, 'id'> & Partial<ISkalaUsaha>>) => {
            state.skalaUsaha = cloneDeep(action.payload);
        },
        setPelakuUsahaPerusahaan: (state, action: PayloadAction<Pick<IPelakuUsaha, 'id'> & Partial<IPelakuUsaha>>) => {
            state.pelakuUsaha = cloneDeep(action.payload);
        },
        setAlamatPerusahaan: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = cloneDeep(action.payload);
        },
        setKontakPerusahaan: (state, action: PayloadAction<IKontak>) => {
            state.kontak = cloneDeep(action.payload);
        },
        setDaftarRegisterDokumenPerusahaan: (state, action: PayloadAction<IDaftarRegisterDokumen>) => {
            state.daftarRegisterDokumen = cloneDeep(action.payload);
        },
    }
});

export const { 
    setPerusahaan, setIdPerusahaan, setNamaPerusahaan,
    setModelPerizinanPerusahaan, setSkalaUsahaPerusahaan,
    setPelakuUsahaPerusahaan, setAlamatPerusahaan, 
    setKontakPerusahaan, setDaftarRegisterDokumenPerusahaan
} = perusahaanSlice.actions;

export default perusahaanSlice.reducer;