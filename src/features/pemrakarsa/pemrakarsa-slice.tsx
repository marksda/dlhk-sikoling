import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAlamat } from "../alamat/alamat-slice";
import { IBentukUsaha } from "../bentuk-usaha/bentuk-usaha-slice";

export interface IPemrakarsa {
    id: string;
    bentukUsaha: IBentukUsaha;
    nomorIndukBerusaha: string;
    nama: string;
    namaNotaris: string;
    alamat: IAlamat;
    telepone: string;
    fax: string;
    npwp: string;
    email: string;
    
}