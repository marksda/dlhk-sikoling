import { IKategoriPelakuUsaha } from "./kategori-pelaku-usaha";

export interface IPelakuUsaha {
    id: string|null;
    nama: string|null;
    singkatan: string|null;
    kategoriPelakuUsaha: Partial<IKategoriPelakuUsaha>|null;
};