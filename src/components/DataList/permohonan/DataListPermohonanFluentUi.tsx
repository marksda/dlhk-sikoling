import { DetailsList, DetailsListLayoutMode, IColumn, IStackTokens } from "@fluentui/react";
import { FC, useCallback } from "react";
import { IListItemRegisterPermohonan, ISubFormDetailPermohonanProps } from "./InterfaceDataListPermohonan";

const _columns = [    
    { key: 'c1', name: 'Tanggal Pengajuan', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c2', name: 'Pemrakarsa', fieldName: 'pemrakarsa', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Jenis Permohonan', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Dokumen Pendukung', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c5', name: 'Status Permohonan', fieldName: 'status', minWidth: 100, maxWidth: 200, isResizable: true },
];

const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPermohonanFluentUI: FC<ISubFormDetailPermohonanProps> = ({dataPermohonan}) => {
    const handleRenderItemColumn = useCallback(
        (item: IListItemRegisterPermohonan, index: number|undefined, column: IColumn|undefined) => {
            // const fieldContent = item[column!.fieldName as keyof IListItemPerusahaan] as string;
            switch (column!.key) {
                case 'c1':
                    return (
                        <span>
                          {item.tanggalRegistrasi}
                        </span>
                    );    
                case 'c2':
                    return (
                        <span>
                            {item.registerPerusahaan?.perusahaan?.nama}
                        </span>
                    ); 
                case 'c3':
                    return (
                        <span>
                            {item.kategoriPermohonan?.nama}
                        </span>
                    );  
                case 'c5':
                    return (
                        <span>
                            {item.statusTahapPemberkasan?.keterangan}
                        </span>
                    ); 
                default:
                    return(<span>ddd</span>);
            }
        },
        []
    );
    return (
        <DetailsList
            columns={_columns}
            items={dataPermohonan}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            onRenderItemColumn={handleRenderItemColumn}
        />
    );
};