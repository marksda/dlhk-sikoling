import { IJabatan } from "./jabatan";
import { IPerson } from "./person";
import { IRegisterPerusahaan } from "./register-perusahaan";

export interface IPenanggungJawab {
    id: string|null;
    person: IPerson|null;
    jabatan: IJabatan|null;
    registerPerusahaan: Partial<IRegisterPerusahaan>|null;
}