import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlamat } from "../alamat/alamat-slice";
import { IKontak } from "../person/person-slice";
import { IModelPerizinan } from "./model-perizinan-api-slice";
import { IPelakuUsaha } from "./pelaku-usaha-api-slice";
import { ISkalaUsaha } from "./skala-usaha";


// export interface IAktaPerusahaan {
//     nomor: string|null;
//     tanggal: string|null;
//     namaNotaris: string|null;
// };

// export interface IKbli {
//     kode: string;
//     nama: string;
// }

// export interface IOss {
//     nib: string|null;
//     tanggal: string|null;
//     kbli: IKbli[];
// }

export interface IPerusahaan {
    id: string|null;
    nama: string|null;
    modelPerizinan: IModelPerizinan|null;
    skalaUsaha: ISkalaUsaha|null;
    pelakuUsaha: IPelakuUsaha|null;
    alamat: IAlamat|null;
    kontakPerusahaan: IKontak|null;
};

const initialState: IPerusahaan = {
    id: null,
    nama: null,
    bentukUsaha: null,
    modelPerizinan: null,
    skalaUsaha: null,
    pelakuUsaha: null,
    alamat: null,
    kontakPerusahaan: null,
}

export const perusahaanSlice = createSlice({
    name: 'perusahaan',
    initialState,
    reducers: {
        setPerusahaan:  (state, action: PayloadAction<IPerusahaan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = {
                desa: {
                    id: action.payload.desa!.id, nama: action.payload.desa!.nama
                },
                kecamatan: {
                    id: action.payload.kecamatan!.id, 
                    nama: action.payload.kecamatan!.nama
                },
                kabupaten: {
                    id: action.payload.kabupaten!.id, 
                    nama: action.payload.kabupaten!.nama
                },
                propinsi: {
                    id: action.payload.propinsi!.id, 
                    nama: action.payload.propinsi!.nama
                },
                keterangan: action.payload.keterangan,
            }
        },
    }
});

export const { setPerusahaan, setAlamat } = perusahaanSlice.actions;

export default perusahaanSlice.reducer;