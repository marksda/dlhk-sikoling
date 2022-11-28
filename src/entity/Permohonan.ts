import { LineItemPermohonan } from "./LineItemPermohonan";

export class Permohonan {
    private _daftarLineItem: LineItemPermohonan[];
    private _tanggalPermohonan: Date;
    private _pemrakarsa: any;


    constructor() {
        this._daftarLineItem = new Array<LineItemPermohonan>();
        this._tanggalPermohonan = new Date();
    }



}