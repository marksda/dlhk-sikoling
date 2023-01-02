import { IRegisterPermohonan } from "../../../features/permohonan/register-permohonan-api-slice";

export type IListItemRegisterPermohonan = {key: string|null;} & Partial<IRegisterPermohonan>;

export interface ISubFormDetailPermohonanProps {
    dataPermohonan: IListItemRegisterPermohonan[];
};