import { FC } from "react";
import { DataListFlowLogFluentUI } from "../../components/DataList/DataListFlowLogFluentUi";


export const DashboardBackEnd: FC = () => {
    return (
        <DataListFlowLogFluentUI 
            title="Tracking log"
            initSelectedFilters={
                {
                    pageNumber: 1,
                    pageSize: 50,
                    filters: [],
                    sortOrders: [
                        {
                            fieldName: 'tanggal',
                            value: 'DESC'
                        },
                    ],
                }
            }
        /> 
    )
}