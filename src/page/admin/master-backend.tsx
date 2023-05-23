import { FC } from "react";
import { DataListAuthorityFluentUI } from "../../components/DataList/DataListAuthorityFluentUi";


export const MasterBackEnd: FC = () => {
    return (
        <DataListAuthorityFluentUI
            title="Authority"
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