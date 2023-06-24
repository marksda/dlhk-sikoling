import { IAlamat } from "./alamat";
import { IJenisKelamin } from "./jenis-kelamin";
import { IKontak } from "./kontak";

export interface IPerson {
    nik: string|null;
    nama: string|null;
    jenisKelamin: Partial<IJenisKelamin>|null;
    alamat: Partial<IAlamat>|null;
    kontak: Partial<IKontak>|null;
    scanKTP: string|null;
};