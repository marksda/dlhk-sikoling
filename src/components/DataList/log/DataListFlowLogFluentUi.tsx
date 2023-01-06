import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens } from "@fluentui/react";
import { FC, useCallback } from "react";
import { IListItemFlowLog, ISubFormDetailFlowLogProps } from "./InterfaceDataListFlowLog";
// import { IListItemRegisterPermohonan, ISubFormDetailPermohonanProps } from "./InterfaceDataListPermohonan";

const _columns = [    
    { key: 'c1', name: 'Tanggal', fieldName: 'tanggal', minWidth: 75, maxWidth: 75, isResizable: true },
    { key: 'c2', name: 'Kategori log', fieldName: 'pemrakarsa', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Posisi berkas', fieldName: 'tahap', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Keterangan', fieldName: 'keterangan', minWidth: 100, maxWidth: 200, isResizable: true }
];

const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListFlowLogFluentUI: FC<ISubFormDetailFlowLogProps> = ({dataFlowLog}) => {
    const handleRenderItemColumn = useCallback(
        (item: IListItemFlowLog, index: number|undefined, column: IColumn|undefined) => {
            // const fieldContent = item[column!.fieldName as keyof IListItemPerusahaan] as string;            
            
            switch (column!.key) {
                case 'c1':
                    return (
                        <span>
                          {item.tanggal}
                        </span>
                    );    
                case 'c2':
                    let registerPermohonan = null;
                    if(item.kategoriFlowLog?.id === '1') {
                        return (
                            <>
                                <span>
                                    {
                                        `${item.kategoriFlowLog?.nama} - ${item.registerPermohonan?.kategoriPermohonan?.nama?.toLowerCase()}`
                                    } 
                                </span><br/>
                                <span>
                                    <b>
                                        {
                                            `${
                                                item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha != undefined ?
                                                item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha.singkatan : null
                                            }. ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}`
                                        }
                                    </b>
                                </span><br/>
                            </>
                        ); 
                    }
                    return (
                        <span>
                            {item.kategoriFlowLog?.nama}
                        </span>
                    ); 
                case 'c3':
                    return (
                        <span>
                            {item.posisiTahapPemberkasan?.nama}
                        </span>
                    );  
                case 'c4':
                    return (
                        <span>
                            {item.keterangan}
                        </span>
                    ); 
                default:
                    return(<span>{item.posisiTahapPemberkasan?.keterangan}</span>);
            }
        },
        []
    );
    return (
        <DetailsList
            columns={_columns}
            items={dataFlowLog}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onRenderItemColumn={handleRenderItemColumn}
        />
    );
};