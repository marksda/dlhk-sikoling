import { IKategoriDokumen } from "../repository/ssot/kategori-dokumen-slice";

export interface IDokumen {
    id: string|null;
    nama: string|null;
    kategoriDokumen: Partial<IKategoriDokumen>|null;
}