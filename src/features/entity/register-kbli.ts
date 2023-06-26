import { IDokumenNibOss } from "./dokumen-nib-oss";
import { IKbli } from "./kbli";

export interface IRegisterKbli {
    dokumenNibOss: Partial<IDokumenNibOss>|null;
    kbli: Partial<IKbli>|null;
};