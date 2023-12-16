import { IKategoriFlowLog } from "./kategori-flow-log";
import { IOtoritas } from "./otoritas";
import { IPosisiTahapPemberkasan } from "./posisi-tahap-pemberkasan";
import { IStatusFlowLog } from "./status-flow-log";

export interface IFlowLog<Type> {
    id: string|null;
    tanggal: string|null;
    kategoriFlowLog: IKategoriFlowLog|null;
    pengirimBerkas: Partial<IPosisiTahapPemberkasan>|null;
    penerimaBerkas: Partial<IPosisiTahapPemberkasan>|null;
    statusFlowLog: Partial<IStatusFlowLog>|null;
    keterangan: string|null;
    pengakses: Partial<IOtoritas>|null;
    data: Type|null;
};

