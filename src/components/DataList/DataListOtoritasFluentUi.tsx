import { IIconProps, Stack, mergeStyleSets, Text, SearchBox, ActionButton, ScrollablePane, DetailsList, IColumn, DirectionalHint, IContextualMenuListProps, IRenderFunction, mergeStyles, DetailsListLayoutMode, SelectionMode, Sticky, StickyPositionType, IDetailsHeaderProps, ContextualMenu, Callout, DatePicker, DayOfWeek, Label, Dropdown, IDropdownOption, PrimaryButton, CommandBar, ICommandBarItemProps, Selection, Toggle } from "@fluentui/react";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { useGetDaftarDataQuery as getDaftarOtoritas, useGetJumlahDataQuery as getJumlahOtoritas } from "../../features/repository/service/otoritas-api-slice";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IOtoritas } from "../../features/entity/otoritas";
import find from "lodash.find";
import { FormulirOtoritas } from "../Formulir/formulir-otoritas";
import { useGetDaftarDataHakAksesQuery } from "../../features/repository/service/sikoling-api-slice";
import { DayPickerIndonesiaStrings, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD, utcFormatStringToDDMMYYYY } from "../../features/config/helper-function";

interface IDataListOtoritasUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemAuthority = {key: string|null;} & Partial<IOtoritas>;
const stackTokens = { childrenGap: 8 };
const iconClass = mergeStyles({
    fontSize: 16,
    height: 24,
    width: 24,
    margin: '0 4px',
  });
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
    deepGreen: [{ color: '#107C10' }, iconClass],
    deepRed: [{ color: '#E81123' }, iconClass],
});
const filterIcon: IIconProps = { iconName: 'Filter' };
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListOtoritasFluentUI: FC<IDataListOtoritasUIProps> = ({initSelectedFilters, title}) => { 

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
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [isModalFormulirOtoritasOpen, { setTrue: showModalFormulirOtoritas, setFalse: hideModalFormulirOtoritas }] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IOtoritas|undefined>(undefined);    
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal', 
            name: 'Tgl. registrasi', 
            fieldName: 'tanggal', 
            minWidth: 120, 
            maxWidth: 120, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemAuthority) => {
                return utcFormatStringToDDMMYYYY(item.tanggal!);
            }
        },
        { 
            key: 'user_name', 
            name: 'User name', 
            fieldName: 'user_name', 
            minWidth: 200, 
            maxWidth: 200, 
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            onRender: (item: IItemAuthority) => {
                return item.userName;
            }
        },
        { 
            key: 'nama', 
            name: 'Identitas person', 
            minWidth: 250, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemAuthority) => {
                return item.person != undefined ?
                    (
                    <div>
                        <span>{item.person.nama != undefined ? item.person.nama:'-'}</span><br />
                        <span>{item.person.nik != undefined ? item.person.nik:'-'}</span><br />
                        <span>
                            {
                                item.person.alamat != undefined ? 
                                item.person.alamat.keterangan != undefined ? item.person.alamat.keterangan:null:null
                            }
                            {
                                item.person.alamat != undefined ? 
                                item.person.alamat.desa != undefined ? `, ${item.person.alamat.desa.nama}`:null:null
                            }
                        </span><br />
                        <span>                            
                            {
                                item.person.alamat != undefined ? 
                                item.person.alamat.kecamatan != undefined ? item.person.alamat.kecamatan.nama:null:null
                            }
                            {
                                item.person.alamat != undefined ? 
                                item.person.alamat.kabupaten != undefined ? `, ${item.person.alamat.kabupaten.nama}`:null:null
                            }
                            {
                                item.person.alamat != undefined ? 
                                item.person.alamat.propinsi != undefined ? `, ${item.person.alamat.propinsi.nama}`:null:null
                            }
                        </span>
                    </div>
                    ) : "-"                    
                ;
            },
            isPadded: true,
        },
        { 
            key: 'hak_akses', 
            name: 'Hak akses', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemAuthority) => {
                return (
                    <span>
                        {
                            item.hakAkses != undefined ? item.hakAkses.nama : null
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'status_internal', 
            name: 'Tipe pengguna', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: true,
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemAuthority) => {
                return (
                    <span>
                        {
                            item.statusInternal != undefined ? item.statusInternal == true ? 'Petugas':'Pemohon':null
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'is_verified', 
            name: 'Approved', 
            minWidth: 40, 
            maxWidth: 40, 
            isResizable: false,            
            onRender: (item: IItemAuthority) => {
                return (
                    <span>{
                        item.isVerified != undefined ? item.isVerified == true ? 'Sudah':'Belum': null 
                    }</span>
                );
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [searchNama, setSearchNama] = useState<string|undefined>(undefined);
    const [searchNik, setSearchNik] = useState<string|undefined>(undefined);
    const [selectedHakAkses, setSelectedHakAkses] = useState<IDropdownOption|null|undefined>(null);
    const [selectedStatusUser, setSelectedStatusUser] = useState<IDropdownOption|null|undefined>(null);
    const searchNamaId = useId('searchNama');
    const searchNikId = useId('searchNik');
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCountPosts } = getJumlahOtoritas(queryFilters);
    const { data: postsOtoritas, isLoading: isLoadingPostsOtoritas } = getDaftarOtoritas(queryParams);
    const { data: postsHakAkses, isLoading: isLoadingPostsHakAkses } = useGetDaftarDataHakAksesQuery({
        pageNumber: 1,
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
                        setFormulirTitle('Add');
                        setModeForm('add');
                        showModalFormulirOtoritas();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit');
                        setModeForm('edit');
                        showModalFormulirOtoritas();
                        let dataTerpilih: IOtoritas = find(postsOtoritas, (i) => i.id == selection.getSelection()[0].key) as IOtoritas;
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
                        showModalFormulirOtoritas();
                        let dataTerpilih: IOtoritas = find(postsOtoritas, (i: IOtoritas) => i.id == selection.getSelection()[0].key) as IOtoritas;
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection]
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

    const _onSearch = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'user_name',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'user_name',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'user_name',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'user_name',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;     
                    
                    
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

    const _onChangeSearchNama = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
            setSearchNama(newValue);          
        },
        []
    );

    const _onSearchNama = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nama',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nama',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nama',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nama',
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

    const _onClearSearchNama= useCallback(
        () => {
            setCurrentPage(1);
            setSearchNama(undefined);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                    
                    
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

    const _onChangeSearchNik = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
            setSearchNik(newValue);          
        },
        []
    );

    const _onSearchNik = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nik',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nik',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nik',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nik',
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

    const _onClearSearchNik= useCallback(
        () => {
            setCurrentPage(1);
            setSearchNik(undefined);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;     
                    
                    
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

    const _onHandleSelectedDate = useCallback(
        (date: Date|null|undefined) => {
            let tanggalTerpilih = utcFormatDateToYYYYMMDD(date!);              

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

            setSelectedDate(date!);
        },
        []
    );

    const _onChangeHakAkses = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'hak_akses'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'hak_akses',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'hak_akses',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'hak_akses'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'hak_akses',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'hak_akses',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedHakAkses(item);
        },
        []
    );

    const _onChangeStatusUser = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'status_internal'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'status_internal',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'status_internal',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'status_internal'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'status_internal',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'status_internal',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedStatusUser(item);
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
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;  
                    
                    if(found != -1) {
                        filters?.splice(found, 1);          
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'hak_akses'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'status_internal'}) as number; 
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
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;  
                    
                    if(found != -1) {
                        filters?.splice(found, 1);          
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'hak_akses'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'status_internal'}) as number; 
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setSelectedDate(undefined);
            setSearchNama(undefined);
            setSearchNik(undefined);
            setSelectedHakAkses(null);
            setSelectedStatusUser(null);
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
            <Stack.Item style={{marginRight: 16}}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item style={{paddingLeft: 16}} align="center">
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
                                    placeholder="pencarian user" 
                                    underlined={false} 
                                    onSearch={_onSearch}
                                    onClear= {_onClearSearch}
                                    disableAnimation
                                />
                            </Stack.Item>
                            <Stack.Item>
                                <ActionButton 
                                    iconProps={filterIcon} 
                                    onClick={_onHandleButtonFilterClick}
                                > 
                                    {
                                        queryFilters.filters?.length as number > 0 ?
                                        <span style={{color: '#16cd16'}}>Filter</span> : <span>Filter</span>
                                    }
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
                                    postsOtoritas != undefined ? postsOtoritas?.map(
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
                            totalCount={postsCount == undefined ? 50:postsCount }
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
                                formatDate={utcFormatDateToDDMMYYYY}
                                onSelectDate={_onHandleSelectedDate}
                                value={selectedDate}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Label htmlFor={searchNamaId}>Nama</Label>
                            <SearchBox 
                                id={searchNamaId}
                                style={{width: 200}} 
                                disableAnimation
                                placeholder="nama sesuai ktp" 
                                underlined={false} 
                                onChange={_onChangeSearchNama}
                                onSearch={_onSearchNama}
                                onClear= {_onClearSearchNama}
                                value={searchNama ? searchNama:''}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Label htmlFor={searchNikId}>NIK</Label>
                            <SearchBox 
                                id={searchNikId}
                                style={{width: 200}} 
                                disableAnimation
                                placeholder="nik sesuai ktp" 
                                underlined={false} 
                                onChange={_onChangeSearchNik}
                                onSearch={_onSearchNik}
                                onClear= {_onClearSearchNik}
                                value={searchNik ? searchNik:''}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Otoritas"
                                placeholder="--Pilih--"
                                options={
                                    postsHakAkses != undefined ? postsHakAkses?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedHakAkses ? selectedHakAkses.key : null}
                                onChange={_onChangeHakAkses}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Tipe user"
                                placeholder="--Pilih--"
                                options={[
                                    {
                                        key: 'true', 
                                        text: 'Petugas'
                                    },
                                    {
                                        key: 'false', 
                                        text: 'Pemohon'
                                    }
                                ]}
                                selectedKey={selectedStatusUser ? selectedStatusUser.key : null}
                                onChange={_onChangeStatusUser}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{marginTop: 16, width: '100%'}}
                                text="Reset" 
                                onClick={_onHandleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }
            {isModalFormulirOtoritasOpen && (
                <FormulirOtoritas
                    title={formulirTitle}
                    isModalOpen={isModalFormulirOtoritasOpen}
                    showModal={showModalFormulirOtoritas}
                    hideModal={hideModalFormulirOtoritas}
                    mode={modeForm}
                    dataLama={dataLama}
                />
            )}
        </Stack>
    );
}