import { IDesa } from "./desa";
import { IKabupaten } from "./kabupaten";
import { IKecamatan } from "./kecamatan";
import { IPropinsi } from "./propinsi";

export interface IAlamat {
    propinsi: Partial<IPropinsi>|null;
    kabupaten: Partial<IKabupaten>|null;
    kecamatan: Partial<IKecamatan>|null;
    desa: Partial<IDesa>|null;
    keterangan: string|null;
}