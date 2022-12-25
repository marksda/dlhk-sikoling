import { IKategoriPermohonan } from "./kategori-permohonan-api-slice";

export interface IRegisterPermohonan {
    id: string|null;
    kategoriPermohonan: IKategoriPermohonan|null;
    
}