import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDesa } from "../desa/desa-slice";
import { IKabupaten } from "../kabupaten/kabupaten-slice";
import { IKecamatan } from "../kecamatan/kecamatan-slice";
import { IPropinsi } from "../propinsi/propinsi-slice";

export interface IAlamat {
    propinsi: IPropinsi|null;
    kabupaten: IKabupaten|null;
    kecamatan: IKecamatan|null;
    desa: IDesa|null;
    keterangan: string|null;
}

const initialState: IAlamat = {
    propinsi: null,
    kabupaten: null,
    kecamatan: null,
    desa: null,
    keterangan: null
}

//redux busines logic
export const alamatSlice = createSlice({
    name: 'alamat',
    initialState,
    reducers: {
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state.desa = {id: action.payload.desa!.id, nama: action.payload.desa!.nama};
            state.kecamatan = {id: action.payload.kecamatan!.id, nama: action.payload.kecamatan!.nama};
            state.kabupaten = {id: action.payload.kabupaten!.id, nama: action.payload.kabupaten!.nama};
            state.propinsi = {id: action.payload.propinsi!.id, nama: action.payload.propinsi!.nama};
            state.keterangan = action.payload.keterangan;
        },
        setAlamatPropinsi: (state, action: PayloadAction<IPropinsi>) => {
            state.propinsi = {id: action.payload.id, nama: action.payload.nama};
        },
        setAlamatKabupaten: (state, action: PayloadAction<IKabupaten|null>) => {
            state.kabupaten = action.payload;
        },
        setAlamatKecamatan: (state, action: PayloadAction<IKecamatan|null>) => {
            state.kecamatan = action.payload;
        },
        setAlamatDesa: (state, action: PayloadAction<IDesa|null>) => {
            state.desa = action.payload;
        },
        setAlamatKeterangan: (state, action: PayloadAction<string|null>) => {
            state.keterangan = action.payload;
        }
    },
}) 

// redux action creator
export const { setAlamat, setAlamatPropinsi, setAlamatKabupaten, setAlamatKecamatan, setAlamatDesa, setAlamatKeterangan} = alamatSlice.actions

export default alamatSlice.reducer