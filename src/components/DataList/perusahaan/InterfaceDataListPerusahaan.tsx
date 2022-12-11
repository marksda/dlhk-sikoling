import { IRegisterPerusahaan } from "../../../features/perusahaan/register-perusahaan-slice";

export type IListItemRegisterPerusahaan = {key: string|null;} & Partial<IRegisterPerusahaan>;