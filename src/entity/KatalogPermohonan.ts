import { DeskripsiPermohonan } from "./DeskripsiPermohonan";

export class KatalogPermohonan {
    private _daftarKatalogPermohonan: DeskripsiPermohonan[];

    constructor(daftarKatalogPermohonan: DeskripsiPermohonan[]) {
        this._daftarKatalogPermohonan = daftarKatalogPermohonan;
    }

}