import { IKecamatan } from "./kecamatan";

export interface IDesa {
    id: string|null;
    nama: string|null;
    kecamatan: Partial<IKecamatan>|null;
}