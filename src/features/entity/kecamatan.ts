import { IKabupaten } from "./kabupaten";

export interface IKecamatan {
    id: string|null;
    nama: string|null;
    kabupaten: Partial<IKabupaten>|null;
}