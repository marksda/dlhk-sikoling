import { ISkalaUsaha } from "./skala-usaha";

export interface IKategoriPelakuUsaha {
    id: string|null;
    nama: string|null;
    skalaUsaha: Partial<ISkalaUsaha>|null;
};