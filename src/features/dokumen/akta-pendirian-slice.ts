import { IPegawai } from "../pegawai/pegawai-slice";

export interface IAktaPendirian {
    id: string|null;
    nama: string|null;
    nomor: string|null;
    tanggal: string|null;
    namaNotaris: string|null;    
    penanggungJawab: Partial<IPegawai>|null;
}