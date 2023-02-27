import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens, SelectionMode } from "@fluentui/react";
import { FC, useCallback } from "react";
import { IListItemFlowLog, ISubFormDetailFlowLogProps } from "./InterfaceDataListFlowLog";
// import { IListItemRegisterPermohonan, ISubFormDetailPermohonanProps } from "./InterfaceDataListPermohonan";

const _columns: IColumn[] = [    
    { 
        key: 'c1', 
        name: 'Tanggal', 
        fieldName: 'tanggal', 
        minWidth: 75, 
        maxWidth: 75, 
        isRowHeader: true,
        isResizable: true,
        data: 'string',
        isPadded: true,
    },
    { 
        key: 'c2', 
        name: 'Kategori log', 
        minWidth: 100, 
        maxWidth: 200, 
        isResizable: true,
        data: 'string',
        onRender: (item: IListItemFlowLog) => {
            if(item.kategoriFlowLog?.id === '1') {
                return (
                    <>
                        <span style={{color: 'green'}}>
                            {
                                `${item.kategoriFlowLog?.nama} : ${item.registerPermohonan?.kategoriPermohonan?.nama?.toLowerCase()}`
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
            else {
                return (
                    <span>
                        {item.kategoriFlowLog?.nama}
                    </span>
                ); 
            }
        }, 
    },
    { 
        key: 'c3', 
        name: 'Pengirim', 
        minWidth: 100, 
        maxWidth: 100, 
        isResizable: true,
        data: 'string',
        onRender: (item: IListItemFlowLog) => {
            return (
                <span>
                    {item.pengirimBerkas?.nama}
                </span>
            ); 
        }
    },
    { 
        key: 'c4', 
        name: 'Penerima', 
        minWidth: 100, 
        maxWidth: 100, 
        isResizable: true,
        data: 'string',
        onRender: (item: IListItemFlowLog) => {
            return (
                <span>
                    {item.penerimaBerkas?.nama}
                </span>
            ); 
        }
    },
    { 
        key: 'c5', 
        name: 'Keterangan', 
        fieldName: 'keterangan', 
        isResizable: true,
        data: 'string',
        onRender: (item: IListItemFlowLog) => {
            return (
                <span>
                    {item.statusFlowLog?.nama}
                </span>
            ); 
        }
    }
];

const _getKey = (item: any, index?: number): string => {
    return item.key;
};

export const DataListFlowLogFluentUI: FC<ISubFormDetailFlowLogProps> = ({dataFlowLog}) => {   
    return (
        <DetailsList
            items={dataFlowLog}
            columns={_columns}
            setKey="none"
            getKey={_getKey}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            isHeaderVisible={true}
        />
    );
};