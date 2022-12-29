import { IPerson } from "../person/person-slice";

export interface IAktaPendirian {
    id: string|null;
    nama: string|null;
    nomor: string|null;
    tanggal: string|null;
    namaNotaris: string|null;    
    pegawai: IPerson|null;
}