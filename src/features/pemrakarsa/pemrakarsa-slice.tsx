import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBentukUsaha } from "../bentuk-usaha/bentuk-usaha-slice";

export interface IPemrakarsa {
    id: string;
    bentukUsaha: IBentukUsaha;
    nomorIndukBerusaha: string;
    nama: string;
    namaNotaris: string;
    
}