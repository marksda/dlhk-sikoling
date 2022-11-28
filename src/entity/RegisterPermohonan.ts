import { KatalogPermohonan } from "./KatalogPermohonan";
import { Permohonan } from "./Permohonan";

export class RegisterPermohonan {

    private _katalogPermohonan: KatalogPermohonan;
    private _permohonan: Permohonan|undefined;
    
    
    constructor(katalogPermohonan: KatalogPermohonan) {
        this._katalogPermohonan = katalogPermohonan;
    }

    public get katalogPermohonan(): KatalogPermohonan {
        return this._katalogPermohonan;
    }

    public set katalogPermohonan(value: KatalogPermohonan) {
        this._katalogPermohonan = value;
    }

    public buatPermohonanBaru(): void {
        this._permohonan = new Permohonan();
    }

    
}