import { IFlowLog, IFlowLogPermohonan } from "../../../features/log/flow-log-api-slice";

export type IListItemFlowLog = {key: string;} & Partial<IFlowLogPermohonan>;

export interface ISubFormDetailFlowLogProps {
    dataFlowLog: IListItemFlowLog[];
}