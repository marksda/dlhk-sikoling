import { ActionButton, Callout, ContextualMenu, DatePicker, DayOfWeek, DetailsList, DetailsListLayoutMode, DirectionalHint, Dropdown, IColumn, IContextualMenuListProps, IDropdownOption, IIconProps, IRenderFunction, IconButton, PrimaryButton, ScrollablePane, SearchBox, SelectionMode, Stack, mergeStyleSets, Text, IDetailsHeaderProps, Sticky, StickyPositionType } from "@fluentui/react";
import { FC, FormEvent, useCallback, useState } from "react";
import { IQueryParams, qFilters } from "../../features/config/query-params-slice";
import { IRegisterPermohonan, useGetAllRegisterPermohonanQuery, useGetTotalCountRegisterPermohonanQuery } from "../../features/permohonan/register-permohonan-api-slice";
import { DayPickerIndonesiaStrings, flipFormatDate, onFormatDate, onFormatDateUtc } from "../../features/config/config";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useGetDaftarKategoriPermohonanByFiltersQuery } from "../../features/permohonan/kategori-permohonan-api-slice";
import { useGetDaftarPosisiTahapPemberkasanByFiltersQuery } from "../../features/permohonan/posisi-tahap-pemberkasan-api-slice";

interface IDataListPermohonanFluentUIProps {
    initSelectedFilters: IQueryParams;
    title?: string;
};
type IItemRegisterPermohonan = {key: string|null;} & Partial<IRegisterPermohonan>;
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

export const DataListPermohonanFluentUI: FC<IDataListPermohonanFluentUIProps> = ({initSelectedFilters, title}) => {    
    
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
    const [selectedJenisPermohonan, setSelectedJenisPermohonan] = useState<IDropdownOption|null|undefined>(null);
    const [selectedPengirim, setSelectedPengirim] = useState<IDropdownOption|null|undefined>(null);
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters});
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal_registrasi', 
            name: 'Tanggal', 
            fieldName: 'tanggalRegistrasi', 
            minWidth: 100, 
            maxWidth: 100, 
            isRowHeader: true,
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemRegisterPermohonan) => {
                return flipFormatDate(item.tanggalRegistrasi!);
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
            key: 'kategori_permohonan', 
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
            key: 'posisi_tahap_pemberkasan_pengirim', 
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
    const { data: postCountRegisterPermohonan, isLoading: isLoadingCount } = useGetTotalCountRegisterPermohonanQuery(queryFilters);
    const { data: postsJenisPermohonan } = useGetDaftarKategoriPermohonanByFiltersQuery({
        pageNumber: 0,
        pageSize: 0,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'DESC'
            },
        ],
    }); 
    const { data: postsPosisiTahapPemberkasan } = useGetDaftarPosisiTahapPemberkasanByFiltersQuery({
        pageNumber: 0,
        pageSize: 0,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });  

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

    const _onContextualMenuFilterDismissed = useCallback(
        () => {
            setContextualMenuFilterProps(undefined);
        },
        []
    );

    const _onSearch = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
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
                    tmp.pageNumber = 1;
                    tmp.filters = filters;             
                    return tmp;
                }
            );
        },
        []
    );

    const _onClearSearch= useCallback(
        () => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan'}) as number;  
                    
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                    
                    tmp.filters = filters;             
                    return tmp;
                }
            );

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan'}) as number;     
                    
                    
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;             
                    return tmp;
                }
            );
        },
        []
    );

    const handleSelectedDate = useCallback(
        (date) => {
            let tanggalTerpilih = onFormatDateUtc(date);

            setCurrentPage(1);

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'tanggal_registrasi'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'tanggal_registrasi',
                            value: tanggalTerpilih
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'tanggal_registrasi',
                            value: tanggalTerpilih
                        });
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedDate(date);
        },
        []
    );

    const onChangeJenisPermohonan = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_permohonan'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'kategori_permohonan',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'kategori_permohonan',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedJenisPermohonan(item);
        },
        []
    );

    const onChangePengirim = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_pengirim'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'posisi_tahap_pemberkasan_pengirim',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'posisi_tahap_pemberkasan_pengirim',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );

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
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedPengirim(item);
        },
        []
    );

    const handleResetFilter = useCallback(
        () => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'tanggal_registrasi'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_permohonan'}) as number;  
                    
                    if(found != -1) {
                        filters?.splice(found, 1);          
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'posisi_tahap_pemberkasan_pengirim'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setSelectedDate(undefined);
            setSelectedJenisPermohonan(null);
            setSelectedPengirim(null);
        },
        []
    );

    const _onHandlePageSizeChange = useCallback(
        (pageSize: number) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);                    
                    tmp.pageSize = pageSize;  
                    tmp.pageNumber = 1;           
                    return tmp;
                }
            );
            setCurrentPage(1);
            setPageSize(pageSize);
        },
        []
    );

    const _onPageNumberChange = useCallback(
        (pageNumber: number) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);                    
                    tmp.pageNumber = pageNumber;      
                    return tmp;
                }
            );
            setCurrentPage(pageNumber);
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
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item style={{paddingLeft: 16}}>
                        <Text variant="xLarge">{title}</Text> 
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal horizontalAlign="end" verticalAlign="center">
                            <Stack.Item>
                                <SearchBox 
                                    style={{width: 300}} 
                                    placeholder="pencarian pemrakarsa" 
                                    underlined={false} 
                                    onSearch={_onSearch}
                                    onClear= {_onClearSearch}
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
                </Stack>
            </Stack.Item>
            <Stack.Item grow>
                <Stack grow verticalFill tokens={stackTokens} className={classNames.container}>
                    <Stack.Item grow className={classNames.gridContainer}>
                        <ScrollablePane scrollbarVisibility="auto">
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
                                onRenderDetailsHeader={_onRenderDetailsHeader}
                            />
                        </ScrollablePane>
                    </Stack.Item>
                    <Stack.Item>
                        <Pagination 
                            currentPage={currentPage}
                            pageSize={pageSize}
                            siblingCount={1}
                            totalCount={postCountRegisterPermohonan == undefined ? 50:postCountRegisterPermohonan}
                            onPageChange={_onPageNumberChange}
                            onPageSizeChange={_onHandlePageSizeChange}
                        />
                    </Stack.Item>
                </Stack>
            </Stack.Item>            
            {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
            {contextualMenuFilterProps && 
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
                                selectedKey={selectedJenisPermohonan ? selectedJenisPermohonan.key : null}
                                onChange={onChangeJenisPermohonan}
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