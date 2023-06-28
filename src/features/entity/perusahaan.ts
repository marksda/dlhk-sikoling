import { IAlamat } from "./alamat";
import { IKontak } from "./kontak";
import { IModelPerizinan } from "./model-perizinan";
import { IPelakuUsaha } from "./pelaku-usaha";
import { IRegisterDokumen } from "./register-dokumen";
import { ISkalaUsaha } from "./skala-usaha";

export interface IPerusahaan {
    id: string|null;
    nama: string|null;
    modelPerizinan: Pick<IModelPerizinan, 'id'> & Partial<IModelPerizinan> | null;
    skalaUsaha: Pick<ISkalaUsaha, 'id'> & Partial<ISkalaUsaha> | null;
    pelakuUsaha: Pick<IPelakuUsaha, 'id'> & Partial<IPelakuUsaha> | null;
    alamat: Partial<IAlamat>|null;
    kontak: Partial<IKontak>|null;
};