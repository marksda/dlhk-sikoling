import { IDokumenNibOss } from "./dokumen-nib-oss";
import { IKbli } from "./kbli";

export interface IRegisterKbli {
    nib: string|null;
    kbli: Partial<IKbli>|null;
};