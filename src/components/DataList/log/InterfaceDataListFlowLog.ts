import { IFlowLog } from "../../../features/log/flow-log-api-slice";

export type IListItemFlowLog = {key: string;} & Partial<IFlowLog>;

export interface ISubFormDetailFlowLogProps {
    dataFlowLog: IListItemFlowLog[];
}