import { IKategoriPermohonan } from "./kategori-permohonan";
import { IRegisterPerusahaan } from "./register-perusahaan";

export interface IRegisterPermohonan {
    id: string|null;
    kategoriPermohonan: Partial<IKategoriPermohonan>|null;
    tanggalRegistrasi: string|null,
    registerPerusahaan: Partial<IRegisterPerusahaan>|null;
    pengurusPermohonan:any|null;
    statusWali: Partial<IStatusWaliPermohonan>|null;
    penanggungJawabPermohonan: Partial<IPegawai>|null;
    pengirimBerkas: Partial<IPosisiTahapPemberkasan>|null;
    penerimaBerkas: Partial<IPosisiTahapPemberkasan>|null;
    statusFlowLog: Partial<IStatusFlowLog>|null;
    daftarDokumenSyarat: IRegisterDokumen[]|null;
    daftarDokumenHasil: IRegisterDokumen[]|null;
};