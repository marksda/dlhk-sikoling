import { DetailsList, IStackTokens } from "@fluentui/react";
import { FC } from "react";

const _columns = [    
    { key: 'c1', name: 'Tanggal Pengajuan', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c2', name: 'Pemrakarsa', fieldName: 'pemrakarsa', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Jenis Permohonan', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Dokumen Pendukung', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Status Permohonan', fieldName: 'status', minWidth: 100, maxWidth: 200, isResizable: true },
];

const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPermohonanFluentUI: FC = () => {
    return (
        <DetailsList
            columns={_columns}
            items={[]}
        />
    );
};