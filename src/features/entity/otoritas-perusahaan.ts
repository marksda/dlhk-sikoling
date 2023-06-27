import { IOtoritas } from "./otoritas";
import { IRegisterPerusahaan } from "./register-perusahaan";

export interface IOtoritasPerusahaan {
    otoritas: Partial<IOtoritas>|undefined;
    registerPerusahaan: Partial<IRegisterPerusahaan>|undefined;
};