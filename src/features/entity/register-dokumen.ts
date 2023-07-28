import { IDokumenAktaPendirian } from "./dokumen-akta-pendirian";
import { IDokumenNibOss } from "./dokumen-nib-oss";
import { IOtoritas } from "./otoritas";
import { IRegisterPerusahaan } from "./register-perusahaan";
import { IStatusDokumen } from "./status-dokumen";

export interface IRegisterDokumen {
    id: string|null;
    dokumen: any|null;
    registerPerusahaan: (Pick<IRegisterPerusahaan, 'id'> & Omit<IRegisterPerusahaan, 'id'>)|null;
    lokasiFile: string|null;
    statusDokumen: Partial<IStatusDokumen>|null;
    tanggalRegistrasi: string|null;
    uploader: Partial<IOtoritas>|null;
    statusVerified: boolean|null;
};