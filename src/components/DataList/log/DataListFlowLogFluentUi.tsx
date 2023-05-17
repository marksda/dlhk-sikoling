import { ActionButton, Callout, ContextualMenu, DatePicker, DayOfWeek, DetailsList, DetailsListLayoutMode, DirectionalHint, Dropdown, IColumn, IContextualMenuListProps, IDetailsHeaderProps, IDropdownOption, IIconProps, IRenderFunction, PrimaryButton, ScrollablePane, SearchBox, SelectionMode, Stack, Sticky, StickyPositionType, mergeStyleSets } from "@fluentui/react";
import { FC, FormEvent, useCallback, useState } from "react";
import { IQueryParams } from "../../../features/config/query-params-slice";
import { IFlowLogPermohonan, useGetAllFlowLogQuery, useGetTotalCountFlowLogQuery } from "../../../features/log/flow-log-api-slice";
import { DayPickerIndonesiaStrings, flipFormatDate, onFormatDate, onFormatDateUtc } from "../../../features/config/config";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../../Pagination/pagination-fluent-ui";
import { useGetAllQuery } from "../../../features/log/kategori-flow-log-api-slice";
import { useGetAllPosisiTahapPemberkasanQuery } from "../../../features/permohonan/posisi-tahap-pemberkasan-api-slice";


interface IDataListFlowLogFluentUIProps {
    initSelectedFilters: IQueryParams;
};
type qFilters = Pick<IQueryParams, "filters">;
type IItemFlowLogPermohonan = {key: string|null;} & Partial<IFlowLogPermohonan>;
const stackTokens = { childrenGap: 8 };
const classNames = mergeStyleSets({
    container: {
        width: "100%",
        position: "relative",
        minHeight: 200,
    },
    gridContainer: {
        height: '100%',
        overflowY: "auto",
        overflowX: "auto",
        position: "relative",
    },
});
const filterIcon: IIconProps = { iconName: 'Filter' };

export const DataListFlowLogFluentUI: FC<IDataListFlowLogFluentUIProps> = ({initSelectedFilters}) => {   
    const handleOnColumnClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
            const items = [
                {
                    key: 'aToZ',
                    name: 'A to Z',
                    iconProps: { iconName: 'SortUp' },
                    canCheck: true,
                    checked: column.isSorted && !column.isSortedDescending,
                    onClick: () => _onSortColumn(column.key, true),
                },
                {
                    key: 'zToA',
                    name: 'Z to A',
                    iconProps: { iconName: 'SortDown' },
                    canCheck: true,
                    checked: column.isSorted && column.isSortedDescending,
                    onClick: () => _onSortColumn(column.key, false),
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
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);    
    const [selectedPengirim, setSelectedPengirim] = useState<IDropdownOption|null|undefined>(null);
    const [selectedPenerima, setSelectedPenerima] = useState<IDropdownOption|null|undefined>(null);
    const [selectedKategoriLog, setSelectedKategoriLog] = useState<IDropdownOption|null|undefined>(null);    
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({...initSelectedFilters.filters} as qFilters);
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal', 
            name: 'Tanggal', 
            fieldName: 'tanggal', 
            minWidth: 75, 
            maxWidth: 75, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: handleOnColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemFlowLogPermohonan) => {
                return flipFormatDate(item.tanggal as string);
            }
        },
        { 
            key: 'perusahaan', 
            name: 'Pemrakarsa', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <div>
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}` : `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}`
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.id !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.id}`: null
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama}`: null
                            }
                            {
                                item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                                `, ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.kecamatan?.nama}`: null
                            }
                        </span>
                    </div>
                    
                );
            },
            isPadded: true,
        },
        { 
            key: 'kategori_log', 
            name: 'Jenis', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                if(item.kategoriFlowLog?.id === '1') {
                    return (
                        <>
                            <span style={{color: 'green'}}>
                                {
                                    `${item.kategoriFlowLog?.nama} : ${item.registerPermohonan?.kategoriPermohonan?.nama?.toLowerCase()}`
                                } 
                            </span><br/>
                            <span>
                                {
                                    `Tanggal registrasi: ${
                                        item.registerPermohonan != undefined ?
                                         flipFormatDate(item.registerPermohonan?.tanggalRegistrasi as string): '-'
                                    }`
                                }
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
            isPadded: true,
        },
        { 
            key: 'posisi_tahap_pemberkasan_pengirim', 
            name: 'Pengirim', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <span>
                        {
                            item.pengirimBerkas?.nama
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'posisi_tahap_pemberkasan_penerima', 
            name: 'Penerima', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <span>{item.penerimaBerkas?.nama}</span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'keterangan', 
            name: 'Keterangan', 
            minWidth: 100, 
            isResizable: true,
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <>
                    <span>
                        *** {item.penerimaBerkas?.keterangan} ***
                    </span><br />
                    <span>
                        {item.statusFlowLog?.nama}
                        {item.keterangan != undefined ? ` : ${item.keterangan}` : null}
                    </span>
                    </>
                ); 
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: postsFlowLog, isLoading: isLoadingPosts } = useGetAllFlowLogQuery(queryParams);
    const { data: postsCountFlowLog, isLoading: isLoadingCountPosts } = useGetTotalCountFlowLogQuery
    (queryFilters);
    const { data: kategoriLogPosts, isLoading: isLOadingKategoriLog } = useGetAllQuery();
    const { data: postsPosisiTahapPemberkasan } = useGetAllPosisiTahapPemberkasanQuery();

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
        },
        []
    );

    const _onSearch = useCallback(
        (newValue) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'perusahaan',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'perusahaan',
                                value: newValue
                            })
                        }
                    }
                    else {
                        if(found > -1) {
                            filters?.splice(found, 1);
                        }
                    }
                    
                    tmp.filters = filters;             
                    return tmp;
                }
            );
        },
        []
    );

    const _onSortColumn = useCallback(
        (key, isAsc: boolean) => {
            let newColumns: IColumn[] = columns.slice();
            let currColumn: IColumn = newColumns.filter(currCol => key === currCol.key)[0];

            newColumns.forEach((newCol: IColumn) => {
                if (newCol === currColumn) {
                  currColumn.isSortedDescending = !isAsc;
                  currColumn.isSorted = true;                  
                } else {
                  newCol.isSortedDescending = undefined;                  
                  newCol.isSorted = false;
                }
            });

            setColumns(newColumns);

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let sortOrders = cloneDeep(tmp.sortOrders);
                    let found = sortOrders?.findIndex((obj) => {return obj.fieldName == key}) as number;   
                    
                    if(found == -1) {
                        sortOrders?.splice(0, 1, {
                            fieldName: key,
                            value: isAsc == true ? "ASC" : "DESC"
                        });
                    }
                    else {
                        sortOrders?.splice(found, 1, {
                            fieldName: key,
                            value: isAsc == true ? "ASC" : "DESC"
                        })
                    }                    
                    
                    tmp.sortOrders = sortOrders;            
                    return tmp;
                }
            );
        },
        [columns]
    );

    const _onContextualMenuDismissed = useCallback(
        () => {
            setContextualMenuProps(undefined);
        },
        []
    );

    const _renderMenuList = useCallback(
        (menuListProps: IContextualMenuListProps, defaultRender: IRenderFunction<IContextualMenuListProps>) => {
          return (
            <div>
                {defaultRender(menuListProps)}
            </div>
          );
        },
        [],
    );

    const _onContextualMenuFilterDismissed = useCallback(
        () => {
            setContextualMenuFilterProps(undefined);
        },
        []
    );

    const handleSelectedDate = useCallback(
        (date) => {
            let tanggalTerpilih = onFormatDateUtc(date);

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'tanggal'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'tanggal',
                            value: tanggalTerpilih
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'tanggal',
                            value: tanggalTerpilih
                        });
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedDate(date);
        },
        []
    );

    const onChangeKategoriLog = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_log'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'kategori_log',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'kategori_log',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );
            setSelectedKategoriLog(item);
        },
        []
    );

    const onChangePengirim = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_pengirim'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'posisi_tahap_pemberkasan_pengiriman',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'posisi_tahap_pemberkasan_pengiriman',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );
            setSelectedPengirim(item);
        },
        []
    );

    const onChangePenerima = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_penerima'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'posisi_tahap_pemberkasan_penerima',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'posisi_tahap_pemberkasan_penerima',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );
            setSelectedPenerima(item);
        },
        []
    );

    const handleResetFilter = useCallback(
        () => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'tanggal'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_log'}) as number;  
                    
                    if(found != -1) {
                        filters?.splice(found, 1);          
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_pengirim'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_penerima'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setSelectedDate(undefined);
            setSelectedKategoriLog(null);
            setSelectedPengirim(null);
            setSelectedPenerima(null);

        },
        []
    );

    const handlePageSizeChange = useCallback(
        (v: number) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);                    
                    tmp.pageSize = v;            
                    return tmp;
                }
            );
            setPageSize(v);
        },
        []
    );
    const _onRenderDetailsHeader  = useCallback(
        (props: IDetailsHeaderProps|undefined, defaultRender?: IRenderFunction<IDetailsHeaderProps>): JSX.Element => {
            return (
                <Sticky stickyPosition={StickyPositionType.Header} isScrollSynced={true}>
                    {defaultRender!({...props!})}
                </Sticky>
            );
        },
        []
    );

    return (
        <Stack grow verticalFill>
            <Stack.Item>
                <Stack horizontal horizontalAlign="end" verticalAlign="center">
                    <Stack.Item>
                        <SearchBox 
                            style={{width: 300}} 
                            placeholder="pencarian pemrakarsa" 
                            underlined={false} 
                            onSearch={_onSearch}
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
            </Stack.Item>
            <Stack.Item grow>
                <Stack grow verticalFill tokens={stackTokens} className={classNames.container}>
                    <Stack.Item grow className={classNames.gridContainer}>
                        <ScrollablePane scrollbarVisibility="auto">
                            <DetailsList
                                items={
                                    postsFlowLog != undefined ? postsFlowLog?.map(
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
                                onRenderDetailsHeader={_onRenderDetailsHeader}
                            />
                        </ScrollablePane>
                    </Stack.Item>
                    <Stack.Item>
                        <Pagination 
                            currentPage={currentPage}
                            pageSize={pageSize}
                            siblingCount={1}
                            totalCount={postsCountFlowLog as number}
                            onPageChange={page => setCurrentPage(page)}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
            {
                contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps} style={{padding: 16}}> 
                    <Stack>
                        <Stack.Item>
                            <DatePicker
                                label="Tanggal"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Pilih tanggal..."
                                ariaLabel="Pilih tanggal"
                                strings={DayPickerIndonesiaStrings}
                                formatDate={onFormatDate}
                                onSelectDate={handleSelectedDate}
                                value={selectedDate}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Jenis log"
                                placeholder="--Pilih--"
                                options={
                                    kategoriLogPosts != undefined ? kategoriLogPosts?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedKategoriLog ? selectedKategoriLog.key : null}
                                onChange={onChangeKategoriLog}
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
                                selectedKey={selectedPengirim ? selectedPengirim.key : null}
                                onChange={onChangePengirim}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Penerima"
                                placeholder="--Pilih--"
                                options={
                                    postsPosisiTahapPemberkasan != undefined ? postsPosisiTahapPemberkasan?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedPenerima ? selectedPenerima.key : null}
                                onChange={onChangePenerima}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{width: 200, marginTop: 16}}
                                text="Reset" 
                                onClick={handleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }
        </Stack>
    );
};