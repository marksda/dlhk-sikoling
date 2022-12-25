import { IPerusahaan } from "../perusahaan/perusahaan-slice";
import { IKategoriPermohonan } from "./kategori-permohonan-api-slice";
import { IStatusTahapPemberkasan } from "./status-tahap-pemberkasan";

// export interface IPermohonan {

// };

export interface IRegisterPermohonan {
    id: string|null;
    kategoriPermohonan: IKategoriPermohonan|null;
    tanggalRegistrasi: string|null,
    perusahaan: IPerusahaan|null;
    detailPermohonan: any|null;    
    kreator: any|null;
    status: IStatusTahapPemberkasan|null;
}