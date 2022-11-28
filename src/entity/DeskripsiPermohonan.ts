export class DeskripsiPermohonan {

    private _id: string;    
    private _deskripsi: string;    

    constructor(id: string, deskripsi: string) {
        this._id = id;
        this._deskripsi = deskripsi;
    }

    public get id(): string {
        return this._id;
    }

    public set id(value: string) {
        this._id = value;
    }

    public get deskripsi(): string {
        return this._deskripsi;
    }

    public set deskripsi(value: string) {
        this._deskripsi = value;
    }
    
}