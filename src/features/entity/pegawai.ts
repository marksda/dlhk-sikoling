import { IJabatan } from "./jabatan";
import { IPerson } from "./person";
import { IRegisterPerusahaan } from "./register-perusahaan";

export interface IPegawai {
    id: string|null;
    perusahaan: Partial<IRegisterPerusahaan>|null;
    person: Partial<IPerson>|null;
    jabatan: Partial<IJabatan>|null;
};