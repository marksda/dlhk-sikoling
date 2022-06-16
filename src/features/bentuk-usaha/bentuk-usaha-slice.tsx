import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IBentukUsaha {
    id: String;
    nama: string;
    singkatan: string;
    idJenisPelakuUsaha: string;
}