import { ActionButton, Callout, CommandBar, ContextualMenu, DatePicker, DayOfWeek, DetailsList, DetailsListLayoutMode, DirectionalHint, Dropdown, IColumn, ICommandBarItemProps, IContextualMenuListProps, IDetailsHeaderProps, IDropdownOption, IIconProps, IRenderFunction, PrimaryButton, ScrollablePane, SearchBox, Selection, SelectionMode, Stack, Sticky, StickyPositionType, Text, Toggle, mergeStyleSets } from "@fluentui/react";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { IFlowLogPermohonan, useGetAllFlowLogQuery, useGetTotalCountFlowLogQuery } from "../../features/log/flow-log-api-slice";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useGetDaftarPosisiTahapPemberkasanByFiltersQuery } from "../../features/permohonan/posisi-tahap-pemberkasan-api-slice";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { DayPickerIndonesiaStrings, utcFormatStringToDDMMYYYY, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { useGetDaftarDataKategoriFlowLogQuery } from "../../features/repository/service/sikoling-api-slice";
import { useBoolean } from "@fluentui/react-hooks";
import { IKategoriFlowLog } from "../../features/entity/kategori-flow-log";
import find from "lodash.find";


interface IDataListFlowLogFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
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
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListFlowLogFluentUI: FC<IDataListFlowLogFluentUIProps> = ({initSelectedFilters, title}) => {   
    const _onHandleColumnClick = useCallback(
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

    const _onHandleButtonFilterClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>): void => {  
            setContextualMenuFilterProps(
                (prev: any) => {
                    if(prev == undefined){
                        return {         
                            target: ev.currentTarget as HTMLElement,
                            directionalHint: DirectionalHint.bottomRightEdge,
                            gapSpace: 2,
                            isBeakVisible: true,
                            onDismiss: _onContextualMenuFilterDismissed,                  
                        };
                    }
                    else {
                        return undefined;
                    }
                }              
            );
        },
        []
    );

    //local state
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirKategoriFlowLogOpen, { setTrue: showModalFormulirKategoriFlowLog, setFalse: hideModalFormulirKategoriFlowLog}] = useBoolean(false);
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [dataLama, setDataLama]= useState<IKategoriFlowLog|undefined>(undefined);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);    
    const [selectedPengirim, setSelectedPengirim] = useState<IDropdownOption|null|undefined>(null);
    const [selectedPenerima, setSelectedPenerima] = useState<IDropdownOption|null|undefined>(null);
    const [selectedKategoriLog, setSelectedKategoriLog] = useState<IDropdownOption|null|undefined>(null);    
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters});    
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal', 
            name: 'Tanggal', 
            fieldName: 'tanggal', 
            minWidth: 85, 
            maxWidth: 85, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemFlowLogPermohonan) => {
                return utcFormatStringToDDMMYYYY(item.tanggal!);
            }
        },
        { 
            key: 'perusahaan', 
            name: 'Pemrakarsa', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
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
            onColumnClick: _onHandleColumnClick,
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
                                        utcFormatStringToDDMMYYYY(item.registerPermohonan?.tanggalRegistrasi!): '-'
                                    }`
                                }
                            </span><br/>
                            <span>
                            Nomor registrasi: <b>
                            {
                                `${
                                    item.registerPermohonan != undefined ?
                                    item.registerPermohonan.id: '-'
                                }`
                            }
                            </b>
                            </span>
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
            onColumnClick: _onHandleColumnClick,
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
            onColumnClick: _onHandleColumnClick,
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
    const { data: postsCountFlowLog, isLoading: isLoadingCountPosts } = useGetTotalCountFlowLogQuery(queryFilters);
    const { data: postsFlowLog, isLoading: isLoadingPosts } = useGetAllFlowLogQuery(queryParams);    
    const { data: kategoriLogPosts, isLoading: isLOadingKategoriLog } = useGetDaftarDataKategoriFlowLogQuery({
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

    const selection: Selection = useMemo(
        () => {
            return new Selection({
                onSelectionChanged: () => {
                    if(selection.count >= 1) {
                        setIsSelectedItem(true);
                    }
                    else {
                        setIsSelectedItem(false);
                    }
                },           
                getKey: (item, index) => {
                    return item.key as string;
                }
            });
        },
        []
    );

    const itemsBar: ICommandBarItemProps[] = useMemo(
        () => {  
            return [
                { 
                    key: 'newItem', 
                    text: 'Add', 
                    iconProps: { iconName: 'Add' }, 
                    onClick: () => {
                        setFormulirTitle('Add status flow log');
                        setModeForm('add');
                        showModalFormulirKategoriFlowLog();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit status flow log');
                        setModeForm('edit');
                        showModalFormulirKategoriFlowLog();                        
                        let dataTerpilih = find(postsFlowLog, (i) => i.id == selection.getSelection()[0].key);
                        setDataLama(dataTerpilih);
                        selection.toggleKeySelected(selection.getSelection()[0].key as string);
                    }
                },
                { 
                    key: 'deleteItem', 
                    text: 'Hapus', 
                    renderedInOverflow: false,
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Delete' }, 
                    onClick: () => {
                        setFormulirTitle('Hapus item');
                        setModeForm('delete');
                        showModalFormulirKategoriFlowLog();
                        let dataTerpilih = find(postsFlowLog, (i) => i.id == selection.getSelection()[0].key);
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection]
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

    const _onChangeSearchNama = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
            if(newValue!.length == 0) {
                _onClearSearch();
            }

            if(newValue!.length > 1) {
                _onSearch(newValue);
            }
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

    const _onHandleSelectedDate = useCallback(
        (tanggal: Date|null|undefined) => {
            let tanggalTerpilih = utcFormatDateToYYYYMMDD(tanggal!);            

            setCurrentPage(1);

            setQueryFilters(
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
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedDate(tanggal!);
            
        },
        []
    );

    const _onChangeKategoriLog = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
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
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKategoriLog(item);
        },
        []
    );

    const _onChangePengirim = useCallback(
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
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );
            
            setSelectedPengirim(item);
        },
        []
    );

    const _onChangePenerima = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
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
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedPenerima(item);
        },
        []
    );

    const _onHandleResetFilter = useCallback(
        () => {
            setCurrentPage(1);

            setQueryFilters(
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

                    tmp.pageNumber = 1;
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

    const _onChangeModalSelection = useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => {            
            if(selection.getSelectedCount() > 0) {
                selection.toggleKeySelected(selection.getSelection()[0].key as string);
            }
            
            setIsModalSelection(checked!);  
        },
        [selection]
    );

    return (
        <Stack grow verticalFill>
            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item style={{paddingLeft: 16}}>
                        <Text variant="xLarge">{title}</Text> 
                    </Stack.Item>
                    <Stack.Item align="center">
                        <Stack horizontal horizontalAlign="end" verticalAlign="center" style={{height: 44}}>
                            {
                                isModalSelection && (
                                    <Stack.Item>
                                        <CommandBar items={itemsBar} style={{minWidth: 250}}/>
                                    </Stack.Item>
                                )
                            } 
                            <Stack.Item>
                                <Stack horizontal tokens={stackTokens}>
                                    <Stack.Item>
                                        <span style={{width: 60}}>Mode edit</span>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Toggle
                                            checked={isModalSelection}
                                            onChange={_onChangeModalSelection}
                                            styles={toggleStyles}
                                            onText="on"
                                            offText="off"
                                        />
                                    </Stack.Item>
                                </Stack>                                
                            </Stack.Item>
                            <Stack.Item>
                                <SearchBox 
                                    style={{width: 300}} 
                                    placeholder="pencarian pemrakarsa" 
                                    underlined={false} 
                                    onChange={_onChangeSearchNama}
                                    onSearch={_onSearch}
                                    onClear= {_onClearSearch}
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <ActionButton 
                                    iconProps={filterIcon} 
                                    onClick={_onHandleButtonFilterClick}
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
                                    postsFlowLog != undefined ? postsFlowLog?.map(
                                        (t) => (
                                            {key: t.id as string, ...omit(t, ['id'])}
                                        )
                                    ) : []
                                }
                                selection={selection}
                                selectionMode={isModalSelection == false ? SelectionMode.none:SelectionMode.single}
                                selectionPreservedOnEmptyClick={true}
                                compact={false}
                                columns={columns}
                                setKey="none"
                                layoutMode={DetailsListLayoutMode.justified}
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
                            totalCount={postsCountFlowLog == undefined ? 50:postsCountFlowLog }
                            onPageChange={_onPageNumberChange}
                            onPageSizeChange={_onHandlePageSizeChange}
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
                                formatDate={utcFormatDateToDDMMYYYY}
                                onSelectDate={_onHandleSelectedDate}
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
                                onChange={_onChangeKategoriLog}
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
                                onChange={_onChangePengirim}
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
                                onChange={_onChangePenerima}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{width: 200, marginTop: 16}}
                                text="Reset" 
                                onClick={_onHandleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }
        </Stack>
    );
};