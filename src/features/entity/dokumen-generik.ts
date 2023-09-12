import { IDokumen } from "./dokumen";
import { IKbli } from "./kbli";

export interface IDokumenGenerik extends IDokumen {
    nomor: string|null;
    tanggal: string|null;
};