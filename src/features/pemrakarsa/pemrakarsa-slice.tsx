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
    id: string;
    bentukUsaha: IBentukUsaha;
    aktaPemrakarsa: IAktaPemrakarsa;
    alamat: IAlamat;
    kontakPemrakarsa: IKontak;
    oss: IOss;    
    nama: string;    
    npwp: string;
    penanggungJawab: IPenanggungJawab;
    idCreator: string;    
};