import { IAlamat } from "../features/alamat/alamat-slice";
import { IKontak } from "../features/person/person-slice";
import { KatalogPermohonan } from "./KatalogPermohonan";
import { RegisterPermohonan } from "./RegisterPermohonan";

export class DLHK {
    private _nama: string;
    private _alamat: IAlamat;
    private _kontak: IKontak;    
    private _katalogPermohonan: KatalogPermohonan;    
    private _registerPermohonan: RegisterPermohonan;    

    constructor(nama: string, alamat: IAlamat, kontak: IKontak, katalogPermohonan: KatalogPermohonan) {
        this._nama = nama;
        this._alamat = alamat;
        this._kontak = kontak;
        this._registerPermohonan = new RegisterPermohonan(katalogPermohonan);
        this._katalogPermohonan = katalogPermohonan;
    }

    public get nama(): string {
        return this._nama;
    }

    public set nama(value: string) {
        this._nama = value;
    }

    public get alamat(): IAlamat {
        return this._alamat;
    }

    public set alamat(value: IAlamat) {
        this._alamat = value;
    }

    public get kontak(): IKontak {
        return this._kontak;
    }

    public set kontak(value: IKontak) {
        this._kontak = value;
    }

    public get katalogPermohonan(): KatalogPermohonan {
        return this._katalogPermohonan;
    }
    
    public set katalogPermohonan(value: KatalogPermohonan) {
        this._katalogPermohonan = value;
    }

    public get registerPermohonan(): RegisterPermohonan {
        return this._registerPermohonan;
    }

    public set registerPermohonan(value: RegisterPermohonan) {
        this._registerPermohonan = value;
    }

}