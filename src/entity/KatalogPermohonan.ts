import find from "lodash.find";
import { DeskripsiPermohonan } from "./DeskripsiPermohonan";

type ItemDeskripsiPermohonan = {itemId: string, deskripsiPermohonan: DeskripsiPermohonan};

export class KatalogPermohonan {
    private _daftarKatalogPermohonan: ItemDeskripsiPermohonan[];
    
    constructor() {
        this._daftarKatalogPermohonan = new Array<ItemDeskripsiPermohonan>();
    }

    public get daftarKatalogPermohonan(): ItemDeskripsiPermohonan[] {
        return this._daftarKatalogPermohonan;
    }

    public set daftarKatalogPermohonan(value: ItemDeskripsiPermohonan[]) {
        this._daftarKatalogPermohonan = value;
    }

    public getDeskripsiPermohonan(itemId: string): DeskripsiPermohonan|undefined {
        let item = find(this._daftarKatalogPermohonan , (obj) => { return obj.itemId == itemId; });
        return item?.deskripsiPermohonan;
    }

    public addDeskripsiPermohonan(item: DeskripsiPermohonan): void {
        this._daftarKatalogPermohonan.push({itemId: item.id, deskripsiPermohonan: item});
    }
}