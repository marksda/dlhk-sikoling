import { IKategoriDokumen } from "./kategori-dokumen";

export interface IDokumen {
    id: string|null;
    nama: string|null;
    kategoriDokumen: Partial<IKategoriDokumen>|null;
}
