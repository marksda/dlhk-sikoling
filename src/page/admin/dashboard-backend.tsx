import { FC } from "react";
import { DataListFlowLogFluentUI } from "../../components/DataList/DataListFlowLogFluentUi";


export const DashboardBackEnd: FC = () => {
    return (
        <DataListFlowLogFluentUI 
            initSelectedFilters={
                {
                    pageNumber: 1,
                    pageSize: 50,
                    filters: [
                        // {
                        //     fieldName: 'posisi_tahap_pemberkasan_penerima',
                        //     value: '2'
                        // }
                    ],
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