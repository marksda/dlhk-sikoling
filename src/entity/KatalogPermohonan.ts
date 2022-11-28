import find from "lodash.find";
import { DeskripsiPermohonan } from "./DeskripsiPermohonan";

export class KatalogPermohonan {
    private _daftarKatalogPermohonan: DeskripsiPermohonan[];
    
    constructor(daftarKatalogPermohonan: DeskripsiPermohonan[]) {
        this._daftarKatalogPermohonan = daftarKatalogPermohonan;
    }

    public get daftarKatalogPermohonan(): DeskripsiPermohonan[] {
        return this._daftarKatalogPermohonan;
    }

    public set daftarKatalogPermohonan(value: DeskripsiPermohonan[]) {
        this._daftarKatalogPermohonan = value;
    }

    public getDeskripsiPermohonan(itemId: string): DeskripsiPermohonan|undefined {
        return find(this._daftarKatalogPermohonan , (obj) => {
            return obj.id == itemId;
        });
    }
}