import { IPerson } from "../person/person-slice";

export interface IHakAkses {
    id: string|null;
    nama: string|null;
    keterangan: string|null;
};

export interface IAuthor {
    id: string|null;
    tanggal: string|null;
    hakAkses: Partial<IHakAkses>|null;
    person: Partial<IPerson>|null;
    statusInternal: boolean|null;
    userName: string|null;
    verified: boolean|null;
};