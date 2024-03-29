import { ActionButton, Callout, ContextualMenu, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, IconButton, IContextualMenuListProps, IIconProps, ILabelStyles, IRenderFunction, ISearchBoxStyles, IStyleSet, Label, Pivot, PivotItem, PrimaryButton, SearchBox, SelectionMode, Stack } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useCallback, useState } from "react";
import { IQueryParams } from "../../features/config/query-params-slice";
import { IRegisterPermohonan, useGetRegisterPermohonanByPenerimaQuery } from "../../features/permohonan/register-permohonan-api-slice";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};
const stackTokens = { childrenGap: 1 };
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 300, marginLeft: 24, marginRight: 8, marginBottom: 8 } };
type IItemRegisterPermohonan = {key: string|null;} & Partial<IRegisterPermohonan>;

const filterIcon: IIconProps = { iconName: 'Filter' };


const DataListPermohonanMasuk = () => {    
    
    const handleOnColumnClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            console.log(column);
            const items = [
                {
                    key: 'aToZ',
                    name: 'A to Z',
                    iconProps: { iconName: 'SortUp' },
                    canCheck: true,
                    checked: column.isSorted && !column.isSortedDescending,
                    onClick: () => _onSortColumn(column.key),
                },
                {
                    key: 'zToA',
                    name: 'Z to A',
                    iconProps: { iconName: 'SortDown' },
                    canCheck: true,
                    checked: column.isSorted && column.isSortedDescending,
                    onClick: () => _onSortColumn(column.key),
                },
            ];
            setContextualMenuProps({         
                onRenderMenuList: _renderMenuList,
                items: items,
                target: ev.currentTarget as HTMLElement,
                directionalHint: DirectionalHint.bottomLeftEdge,
                gapSpace: 2,
                // isBeakVisible: true,
                onDismiss: _onContextualMenuDismissed,                  
            });
        },
        []
    );

    const handleButtonFilterClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>): void => {       
            console.log(ev);     
            setContextualMenuFilterProps({         
                // onRenderMenuList: _renderMenuList,
                target: ev.currentTarget as HTMLElement,
                directionalHint: DirectionalHint.bottomRightEdge,
                gapSpace: 2,
                isBeakVisible: true,
                onDismiss: _onContextualMenuFilterDismissed,                  
            });
        },
        []
    );

    //local state
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
        sortBy: [],
    });

    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'k1', 
            name: 'Tanggal', 
            fieldName: 'tanggalRegistrasi', 
            minWidth: 100, 
            maxWidth: 100, 
            isRowHeader: true,
            isResizable: true,
            onColumnClick: handleOnColumnClick,
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
    ]);    
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: posts, isLoading } = useGetRegisterPermohonanByPenerimaQuery({
        idPenerima: '1', 
        queryParams
    });   

    const _renderMenuList = useCallback(
        (menuListProps: IContextualMenuListProps, defaultRender: IRenderFunction<IContextualMenuListProps>) => {
          return (
            <div>
                {defaultRender(menuListProps)}
                <SearchBox
                    ariaLabel="Filter actions by text"
                    placeholder="Pencarian"
                    styles={searchBoxStyles}

                />
            </div>
          );
        },
        [],
    );

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
        },
        []
    );

    const _onContextualMenuDismissed = useCallback(
        () => {
            setContextualMenuProps(undefined);
        },
        []
    );

    const _onSortColumn = useCallback(
        (key) => {
            let newColumns: IColumn[] = columns.slice();
            let currColumn: IColumn = newColumns.filter(currCol => key === currCol.key)[0];

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
        [columns]
    );

    const _onContextualMenuFilterDismissed = useCallback(
        () => {
            setContextualMenuFilterProps(undefined);
        },
        []
    );

    return (
        <>
            <Stack tokens={stackTokens}>
                <Stack horizontal horizontalAlign="end" verticalAlign="center">
                    <Stack.Item>
                        <SearchBox 
                            style={{width: 300}} 
                            placeholder="pencarian pemrakarsa" 
                            underlined={false} 
                        />
                    </Stack.Item>
                    <Stack.Item>
                        <ActionButton 
                            iconProps={filterIcon} 
                            onClick={handleButtonFilterClick}
                        > 
                            Filter
                        </ActionButton>       
                    </Stack.Item>
                </Stack>
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
            </Stack>
            {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
            {contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps}> 
                    <Stack tokens={stackTokens}>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{marginTop: 16, width: 100}}
                                text="Simpan" 
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>
                
            }
        </>
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
                style={{padding: 8}}
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
