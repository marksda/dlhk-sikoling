import { IPerson } from "../person/person-slice";

interface IHakAkses {
    id: string|null;
    nama: string|null;
    keterangan: string|null;
}
export interface IAuthor {
    hakAkses: Partial<IHakAkses>|null;
    person: Partial<IPerson>|null;
    statusInternal: boolean|null;
    userName: string|null;
    verified: boolean|null;
};