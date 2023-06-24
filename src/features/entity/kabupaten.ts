import { IPropinsi } from "./propinsi";

export interface IKabupaten {
    id: string|null;
    nama: string|null;
    propinsi: Partial<IPropinsi>|null;
}
