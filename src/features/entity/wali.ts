import { IUser } from "./user";

export interface IStatusWaliPermohonan {
    user: Partial<IUser>|null;
    status: Partial<IStatusWaliPermohonan>|null;
}