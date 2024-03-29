import { IOtoritas } from "./otoritas";
import { IRegisterPerusahaan } from "./register-perusahaan";
import { IStatusDokumen } from "./status-dokumen";

export interface IRegisterDokumen<Type> {
    id: string|null;
    dokumen: Type|null;
    registerPerusahaan: (Pick<IRegisterPerusahaan, 'id'> & Omit<IRegisterPerusahaan, 'id'>)|null;
    lokasiFile: string|null;
    statusDokumen: Partial<IStatusDokumen>|null;
    tanggalRegistrasi: string|null;
    uploader: Partial<IOtoritas>|null;
    statusVerified: boolean|null;
};