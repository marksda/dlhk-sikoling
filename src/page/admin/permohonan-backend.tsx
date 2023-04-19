import { ActionButton, Callout, ContextualMenu, DatePicker, DayOfWeek, DetailsList, DetailsListLayoutMode, DirectionalHint, Dropdown, IColumn, IconButton, IContextualMenuListProps, IIconProps, ILabelStyles, IRenderFunction, ISearchBoxStyles, IStyleSet, Label, Pivot, PivotItem, PrimaryButton, SearchBox, SelectionMode, Stack } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useCallback, useState } from "react";
import { DayPickerIndonesiaStrings, flipFormatDate, onFormatDate, onFormatDateUtc } from "../../features/config/config";
import { IQueryParams } from "../../features/config/query-params-slice";
import { useGetAllKategoriPermohonanQuery } from "../../features/permohonan/kategori-permohonan-api-slice";
import { IPosisiTahapPemberkasan, useGetAllPosisiTahapPemberkasanQuery } from "../../features/permohonan/posisi-tahap-pemberkasan-api-slice";
import { IRegisterPermohonan, useGetAllRegisterPermohonanQuery, useGetRegisterPermohonanByPenerimaQuery } from "../../features/permohonan/register-permohonan-api-slice";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};
const stackTokens = { childrenGap: 8 };
const searchBoxStyles: Partial<ISearchBoxStyles> = { root: { width: 300, marginLeft: 24, marginRight: 8, marginBottom: 8 } };
type IItemRegisterPermohonan = {key: string|null;} & Partial<IRegisterPermohonan>;

const filterIcon: IIconProps = { iconName: 'Filter' };

const DataListPermohonanMasuk = () => {    
    
    const handleOnColumnClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            // console.log(column);
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
            setContextualMenuFilterProps({         
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
        pageSize: 0,
        filters: [
            {
                fieldName: 'posisi_tahap_pemberkasan_penerima',
                value: '1'
            }
        ],
        sortOrders: [
            {
                fieldName: 'perusahaan',
                value: 'ASC'
            },
        ],
    });
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
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
            onRender: (item: IItemRegisterPermohonan) => {
                return flipFormatDate(item.tanggalRegistrasi!);
            }
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
                    <IconButton iconProps={{ iconName: 'Edit' }} title="Edit" ariaLabel="Edit" onClick={() => alert('sss')}/>
                );
            },
            isPadded: true,
        },
    ]);    
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: posts, isLoading } = useGetAllRegisterPermohonanQuery(queryParams);   
    // const { data: posts, isLoading } = useGetRegisterPermohonanByPenerimaQuery({
    //     idPenerima: '1', 
    //     queryParams
    // });   
    const { data: postsJenisPermohonan } = useGetAllKategoriPermohonanQuery(); 
    const { data: postsPosisiTahapPemberkasan } = useGetAllPosisiTahapPemberkasanQuery();  

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

    const handleSelectedDate = useCallback(
        (date) => {
            return onFormatDateUtc(date);
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
                <Callout {...contextualMenuFilterProps} style={{padding: 16}}> 
                    <Stack>
                        <Stack.Item>
                            <DatePicker
                                label="Tanggal"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                strings={DayPickerIndonesiaStrings}
                                formatDate={onFormatDate}
                                onSelectDate={handleSelectedDate}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Jenis permohonan"
                                placeholder="--Pilih--"
                                options={
                                    postsJenisPermohonan != undefined ? postsJenisPermohonan?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Pengirim"
                                placeholder="--Pilih--"
                                options={
                                    postsPosisiTahapPemberkasan != undefined ? postsPosisiTahapPemberkasan?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{width: 200, marginTop: 16}}
                                text="Reset" 
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
