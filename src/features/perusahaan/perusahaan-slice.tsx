import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlamat } from "../alamat/alamat-slice";
import { IBentukUsaha } from "../bentuk-usaha/bentuk-usaha-slice";
import { IPenanggungJawab } from "../penanggung-jawab/penanggung-jawab-slice";
import { IKontak } from "../person/person-slice";


export interface IAktaPerusahaan {
    nomor: string|null;
    tanggal: string|null;
    namaNotaris: string|null;
};

export interface IKbli {
    kode: string;
    nama: string;
}

export interface IOss {
    nib: string|null;
    tanggal: string|null;
    kbli: IKbli[];
}

export interface IPerusahaan {
    id: string|null;
    bentukUsaha: IBentukUsaha|null;
    aktaPerusahaan: IAktaPerusahaan|null;
    alamat: IAlamat|null;
    kontakPerusahaan: IKontak|null;
    oss: IOss|null;    
    nama: string|null;    
    npwp: string|null;
    penanggungJawab: IPenanggungJawab|null;
    idCreator: string|null;    
};

const initialState: IPerusahaan = {
    id: null,
    bentukUsaha: null,
    aktaPerusahaan: null,
    alamat: null,
    kontakPerusahaan: null,
    oss: null,
    nama: null,
    npwp: null,
    penanggungJawab: null,
    idCreator: null
}

export const perusahaanSlice = createSlice({
    name: 'perusahaan',
    initialState,
    reducers: {
        setPerusahaan:  (state, action: PayloadAction<IPerusahaan>) => {
            state.id = action.payload.id;
            state.nama = action.payload.nama;
        },
        setBentukUsaha: (state, action: PayloadAction<IBentukUsaha>) => {
            state.bentukUsaha = {
                id: action.payload.id,
                nama: action.payload.nama,
                singkatan: action.payload.singkatan,
            }
        },
        setAktaPerusahaan: (state, action: PayloadAction<IAktaPerusahaan>) => {
            state.aktaPerusahaan = {
                nomor: action.payload.nomor,
                tanggal: action.payload.tanggal,
                namaNotaris: action.payload.namaNotaris,
            }
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

export const { setPerusahaan: setPemrakarsa, setBentukUsaha, setAktaPerusahaan: setAktaPemrakarsa, setAlamat } = perusahaanSlice.actions;

export default perusahaanSlice.reducer;