import { IKategoriPermohonan } from "./kategori-permohonan";
import { IOtoritas } from "./otoritas";
import { IPegawai } from "./pegawai";
import { IPosisiTahapPemberkasan } from "./posisi-tahap-pemberkasan";
import { IRegisterDokumen } from "./register-dokumen";
import { IRegisterPerusahaan } from "./register-perusahaan";
import { IStatusFlowLog } from "./status-flow-log";
import { IStatusWaliPermohonan } from "./status-wali-permohonan";

export interface IRegisterPermohonan {
    id: string|null;
    kategoriPermohonan: Partial<IKategoriPermohonan>|null;
    tanggalRegistrasi: string|null,
    registerPerusahaan: Partial<IRegisterPerusahaan>|null;
    pengurusPermohonan: Partial<IOtoritas>|null;
    statusWali: Partial<IStatusWaliPermohonan>|null;
    penanggungJawabPermohonan: Partial<IPegawai>|null;
    pengirimBerkas: Partial<IPosisiTahapPemberkasan>|null;
    penerimaBerkas: Partial<IPosisiTahapPemberkasan>|null;
    statusFlowLog: Partial<IStatusFlowLog>|null;
    daftarDokumenSyarat: IRegisterDokumen<any>[]|null;
    daftarDokumenHasil: IRegisterDokumen<any>[]|null;
};