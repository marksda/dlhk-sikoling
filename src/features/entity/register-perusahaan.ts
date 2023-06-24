import { IOtoritas } from "./otoritas";
import { IPerusahaan } from "./perusahaan";

export interface IRegisterPerusahaan {
    id: string|null,
    tanggalRegistrasi: string|null;
    kreator: Partial<IOtoritas>|null;
    verifikator: Partial<IOtoritas>|null;
    perusahaan: Partial<IPerusahaan>|null;
    statusVerifikasi: boolean|null
};