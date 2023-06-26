import { IDokumen } from "./dokumen";
import { IPegawai } from "./pegawai";

export interface IDokumenAktaPendirian extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
    namaNotaris: string|null;    
    penanggungJawab: Partial<IPegawai>|null;
}