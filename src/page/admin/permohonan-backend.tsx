import { DetailsList, DetailsListLayoutMode, IColumn, IconButton, ILabelStyles, IStyleSet, Label, Pivot, PivotItem, SelectionMode } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useCallback, useState } from "react";
import { IQueryParams } from "../../features/config/query-params-slice";
import { IRegisterPermohonan, useGetRegisterPermohonanByPenerimaQuery } from "../../features/permohonan/register-permohonan-api-slice";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};
type IItemRegisterPermohonan = {key: string|null;} & Partial<IRegisterPermohonan>;

const DataListPermohonanMasuk = () => {
    const handleOnColumnClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            let newColumns: IColumn[] = columns.slice();
            let currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];

            newColumns.forEach((newCol: IColumn) => {
                if (newCol === currColumn) {
                  currColumn.isSortedDescending = !currColumn.isSortedDescending;
                  currColumn.isSorted = true;                  
                } else {
                  newCol.isSorted = false;
                  newCol.isSortedDescending = true;
                }
            });

            setColumns(newColumns);
        },
        []
    );

    const _columns_permohonan_masuk: IColumn[] = [    
        { 
            key: 'k1', 
            name: 'Tanggal', 
            fieldName: 'tanggalRegistrasi', 
            minWidth: 100, 
            maxWidth: 100, 
            isRowHeader: true,
            isResizable: true,
            // isSorted: true,
            // isSortedDescending: false,
            // sortAscendingAriaLabel: 'Sorted A to Z',
            // sortDescendingAriaLabel: 'Sorted Z to A',
            onColumnClick: handleOnColumnClick,
            // data: 'number',
            isPadded: true,
        },
        { 
            key: 'k2', 
            name: 'Pemrakarsa', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemRegisterPermohonan) => {
                return (
                    <div>
                        <span>
                            {
                            item.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPerusahaan?.perusahaan?.nama}` : `${item.registerPerusahaan?.perusahaan?.nama}`
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPerusahaan?.perusahaan?.id !== undefined ?
                            `${item.registerPerusahaan?.perusahaan?.id}`: null
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                            `${item.registerPerusahaan?.perusahaan?.alamat?.desa?.nama}`: null
                            }
                            {
                                item.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                                `, ${item.registerPerusahaan?.perusahaan?.alamat?.kecamatan?.nama}`: null
                            }
                        </span>
                    </div>
                    
                );
            },
            isPadded: true,
        },
        { 
            key: 'k3', 
            name: 'Jenis Permohonan', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemRegisterPermohonan) => {
                return (
                    <span>
                        {
                            item.kategoriPermohonan?.nama
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'k4', 
            name: 'Pengirim', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            onRender: (item: IItemRegisterPermohonan) => {
                return (
                    <span>{item.pengirimBerkas?.nama}</span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'k5', 
            name: 'Status Permohonan', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onRender: (item: IItemRegisterPermohonan) => {
                return (
                    <span>{item.statusFlowLog?.nama}</span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'k6', 
            name: 'Edit', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onRender: (item: IItemRegisterPermohonan) => {
                return (
                    <IconButton iconProps={{ iconName: 'Edit' }} title="Edit" ariaLabel="Edit" />
                );
            },
            isPadded: true,
        },
    ];

    const [queryParams, setQueryParams] = useState<IQueryParams>({
        pageNumber: 0,
        pageSize: 10,
        filter: [
            {
                fieldName: '1',
                value: 'sda'
            },
            {
                fieldName: '2',
                value: 'oke'
            }
        ],
        sortBy: null,
    });

    const [columns, setColumns] = useState<IColumn[]>([..._columns_permohonan_masuk]);    

    const { data: posts, isLoading } = useGetRegisterPermohonanByPenerimaQuery({
        idPenerima: '1', 
        queryParams
    });

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
        },
        []
    );

    return (
        <DetailsList 
            items={
                posts != undefined ? posts?.map(
                    (t) => (
                        {key: t.id as string, ...omit(t, ['id'])}
                    )
                ) : []
            }
            compact={true}
            columns={columns}
            setKey="none"
            getKey={_getKey}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            isHeaderVisible={true}
        />
    );
};

export const PermohonanBackEnd: FC = () => {
    // const token = useAppSelector((state) => state.token);
    // console.log(token);

    return (
        <Pivot>
            <PivotItem
                headerText="Permohonan Masuk"
                headerButtonProps={{
                'data-order': 1,
                'data-title': 'baru',
                }}
                itemIcon="DownloadDocument"
            >
                <DataListPermohonanMasuk />
            </PivotItem>
            <PivotItem 
                headerText="Permohonan Keluar"
                itemIcon="Generate"
            >
                <Label styles={labelStyles}>Pivot #2</Label>
            </PivotItem>
            <PivotItem 
                headerText="Permohonam Selesai"
                itemIcon="DocumentApproval"    
            >
                <Label styles={labelStyles}>Pivot #3</Label>
            </PivotItem>
            <PivotItem 
                headerText="Permohonan Tertolak"
                itemIcon="PageRemove"
            >
                <Label styles={labelStyles}>Pivot #3</Label>
            </PivotItem>
        </Pivot>
    )
};
