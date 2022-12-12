import { IRegisterPerusahaan } from "../../../features/perusahaan/register-perusahaan-slice";

export type IListItemRegisterPerusahaan = {key: string|null;} & Partial<IRegisterPerusahaan>;
export interface ISubFormDetailPerusahaanProps {
    showModalAddPerusahaan: () => void;
    hideModalAddModalPerusahaan?: () => void;
    isDataLoading: boolean;
    dataPerusahaan: IListItemRegisterPerusahaan[];
    deletePerusahaan: any;    
};