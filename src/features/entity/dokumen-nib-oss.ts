import { IDokumen } from "./dokumen";
import { IRegisterKbli } from "./register-kbli";

export interface IDokumenNibOss extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
    daftarRegisterKbli: IRegisterKbli[]|null;
};