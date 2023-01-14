import { CommandBar, DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IObjectWithKey, IStackTokens, mergeStyles, mergeStyleSets, Selection, SelectionMode, Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { IKbli } from "../../features/dokumen/kbli-slice";

const _columns = [
    { key: 'c1', name: 'Kode', fieldName: 'kode', minWidth: 45, maxWidth: 45, isResizable: false },
    { key: 'c2', name: 'Keterangan', fieldName: 'nama', minWidth: 250, maxWidth: 300, isResizable: false },
    { key: 'c3', name: 'Hapus', fieldName: 'ubah', minWidth: 45, maxWidth: 45, isResizable: false }
];

const contentStyles = mergeStyleSets({
    wrapText: {
        textOverflow: 'clip',
        wordWrap: 'break-word',
        display: 'inline-block',
        whiteSpace: 'normal',
    }
});

export const DataListKbliFluentUI: FC<{daftarKbli: Partial<IKbli>[]}> = ({daftarKbli}) => {
    
    const handleRenderItemColumn = useCallback(
        (item: Partial<IKbli>, index: number|undefined, column: IColumn|undefined) => {
            switch (column!.key) {
                case 'c1':
                    return (item.kode);
                case 'c2':
                    return (
                        <p className={contentStyles.wrapText}>{item.nama}</p>
                    );
                default:
                    return (
                        <div>
                            delete
                        </div>
                    );
            }
        },
        []
    );

    return(     
        <>
        <Stack>
            <DetailsList
                items={daftarKbli}
                columns={_columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selectionMode={SelectionMode.none}
                compact={false}
                onRenderItemColumn={handleRenderItemColumn}
            />    
        </Stack>
        </> 
    );    
    
}