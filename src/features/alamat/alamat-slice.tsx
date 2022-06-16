import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IKabupaten } from "../kabupaten/kabupaten-slice";
import { IKecamatan } from "../kecamatan/kecamatan-slice";
import { IPropinsi } from "../propinsi/propinsi-slice";

export interface IAlamat {
    propinsi: IPropinsi;
    kabupaten: IKabupaten;
    kecamatan: IKecamatan;
}