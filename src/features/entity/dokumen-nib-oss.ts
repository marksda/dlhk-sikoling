import { IDokumen } from "./dokumen";
import { IKbli } from "./kbli";

export interface IDokumenNibOss extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
    daftarKbli: IKbli[]|null;
};