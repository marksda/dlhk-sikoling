import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlamat } from "../alamat/alamat-slice";
import { IBentukUsaha } from "../bentuk-usaha/bentuk-usaha-slice";
import { IPenanggungJawab } from "../penanggung-jawab/penanggung-jawab-slice";
import { IKontak } from "../person/person-slice";


export interface IAktaPemrakarsa {
    nomor: string;
    tanggal: string;
    namaNotaris: string;
};

export interface IKbli {
    kode: string;
    nama: string;
}

export interface IOss {
    nib: string;
    tanggal: string;
    kbli: IKbli[];
}

export interface IPemrakarsa {
    id: string|null;
    bentukUsaha: IBentukUsaha|null;
    aktaPemrakarsa: IAktaPemrakarsa|null;
    alamat: IAlamat|null;
    kontakPemrakarsa: IKontak|null;
    oss: IOss|null;    
    nama: string|null;    
    npwp: string|null;
    penanggungJawab: IPenanggungJawab|null;
    idCreator: string|null;    
};

const initialState: IPemrakarsa = {
    id: null,
    bentukUsaha: null,
    aktaPemrakarsa: null,
    alamat: null,
    kontakPemrakarsa: null,
    oss: null,
    nama: null,
    npwp: null,
    penanggungJawab: null,
    idCreator: null
}

export const pemrakarsaSlice = createSlice({
    name: 'pemrakarsa',
    initialState,
    reducers: {
        setPemrakarsa:  (state, action: PayloadAction<IPemrakarsa>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setBentukUsaha: (state, action: PayloadAction<IBentukUsaha>) => {
            state.bentukUsaha = {
                id: action.payload.id,
                nama: action.payload.nama,
                singkatan: action.payload.singkatan,
                idJenisPelakuUsaha: action.payload.idJenisPelakuUsaha,
            }
        },
        setAktaPemrakarsa: (state, action: PayloadAction<IAktaPemrakarsa>) => {
            state.aktaPemrakarsa = {
                nomor: action.payload.nomor,
                tanggal: action.payload.tanggal,
                namaNotaris: action.payload.namaNotaris,
            }
        },
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.alamat = {
                desa: {
                    id: action.payload.desa?.id, nama: action.payload.desa?.nama
                },
                kecamatan: {
                    id: action.payload.kecamatan?.id, 
                    nama: action.payload.kecamatan?.nama
                },
                kabupaten: {
                    id: action.payload.kabupaten?.id, 
                    nama: action.payload.kabupaten?.nama
                },
                propinsi: {
                    id: action.payload.propinsi.id, 
                    nama: action.payload.propinsi.nama
                },
                keterangan: action.payload.keterangan,
            }
        },
    }
});

export const { setPemrakarsa, setBentukUsaha, setAktaPemrakarsa, setAlamat } = pemrakarsaSlice.actions;

export default pemrakarsaSlice.reducer;