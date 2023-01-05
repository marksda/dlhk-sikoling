import { IPosisiTahapPemberkasan } from "../permohonan/posisi-tahap-pemberkasan-api-slice";
import { IAuthorization } from "../security/authorization-slice";

export interface IKategoriFlowLog {
    id: string|null;
    tanggal: string|null;
    kategoriFlowLog: IKategoriFlowLog|null;
    posisiTahapPemberkasan: IPosisiTahapPemberkasan|null;
    keterangan: string|null;
    pengakses: IAuthorization|null;
}