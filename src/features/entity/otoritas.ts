import { IHakAkses } from "./hak-akses";
import { IPerson } from "./person";

export interface IOtoritas {
    id: string|null;
    tanggal: string|null;
    hakAkses: Partial<IHakAkses>|null;
    person: Partial<IPerson>|null;
    // statusInternal: boolean|null;
    userName: string|null;
    isVerified: boolean|null;
};