import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IDesa } from "../desa/desa-slice";
import { IKabupaten } from "../kabupaten/kabupaten-slice";
import { IKecamatan } from "../kecamatan/kecamatan-slice";
import { IPropinsi } from "../propinsi/propinsi-slice";

export interface IAlamat {
    propinsi: IPropinsi;
    kabupaten: IKabupaten;
    kecamatan: IKecamatan;
    desa: IDesa;
    keterangan: string
}

const initialState: IAlamat = {
    propinsi: {} as IPropinsi,
    kabupaten: {} as IKabupaten,
    kecamatan: {} as IKecamatan,
    desa: {} as IDesa,
    keterangan: ''
}

//redux busines logic
export const alamatSlice = createSlice({
    name: 'alamat',
    initialState,
    reducers: {
        setAlamat: (state, action: PayloadAction<IAlamat>) => {
            state = action.payload;
        },
        setAlamatPropinsi: (state, action: PayloadAction<IPropinsi>) => {
            state.propinsi = action.payload;
        },
        setAlamatKabupaten: (state, action: PayloadAction<IKabupaten>) => {
            state.propinsi = action.payload;
        },
        setAlamatKecamatan: (state, action: PayloadAction<IKecamatan>) => {
            state.kecamatan = action.payload;
        },
        setAlamatDesa: (state, action: PayloadAction<IDesa>) => {
            state.desa = action.payload;
        },
        setAlamatKeterangan: (state, action: PayloadAction<string>) => {
            state.keterangan = action.payload;
        }
    },
}) 

// redux action creator
export const { setAlamat, setAlamatPropinsi: setPropinsi, setAlamatKabupaten: setKabupaten, setAlamatKecamatan: setKecamatan, setAlamatDesa: setDesa, setAlamatKeterangan: setKeterangan} = alamatSlice.actions

export default alamatSlice.reducer