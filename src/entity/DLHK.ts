import { IAlamat } from "../features/alamat/alamat-slice";
import { IKontak } from "../features/person/person-slice";
import { RegisterPermohonan } from "./RegisterPermohonan";

export class DLHK {
    private nama: string;
    private alamat: IAlamat;
    private kontak: IKontak;
    private registerPermohonan: RegisterPermohonan;

    constructor(nama: string, alamat: IAlamat, kontak: IKontak,
        registerPermohonan: RegisterPermohonan) {
        this.nama = nama;
        this.alamat = alamat;
        this.kontak = kontak;
        this.registerPermohonan = registerPermohonan;
    }
    
    

}