import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps,  IRenderFunction, Stack, mergeStyleSets, Text, SearchBox, ScrollablePane, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IDetailsHeaderProps, Sticky, StickyPositionType, ContextualMenu, Callout, Label, ActionButton, IIconProps, PrimaryButton, CommandBar, ICommandBarItemProps, Toggle} from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { invertParseNpwp } from "../../features/config/helper-function";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { useGetDaftarDataRegisterDokumenQuery, useGetJumlahDataRegisterDokumenQuery } from "../../features/repository/service/sikoling-api-slice";
import find from "lodash.find";
import { FormulirRegisterDokumen } from "../Formulir/formulir-register-dokumen";
import { flipFormatDate } from "../../features/config/config";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";

interface IDataListRegisterDokumenFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemRegisterDokumen = {key: string|null;} & Partial<IRegisterDokumen>;
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
    kontakContainer: {
        margin: 0
    },
    kontakLabel: {
        padding: '4px 0px',
        display: 'block'
    },
    kontakCardLabel: {
        borderRadius: 3,
        marginLeft: 4,
        padding: 4,
        backgroundColor: 'green',
        boxShadow: DefaultEffects.elevation4,
        display: 'block',
        color: 'white'
    },
});
const filterIcon: IIconProps = { iconName: 'Filter' };
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListRegisterDokumenFluentUI: FC<IDataListRegisterDokumenFluentUIProps> = ({initSelectedFilters, title}) => {   
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
                            }
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
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([ 
        { 
            key: 'tanggalRegistrasi', 
            name: 'Tanggal', 
            minWidth: 70, 
            maxWidth: 70, 
            isResizable: true,             
            isSortedDescending: false,
            isSorted: true,
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return flipFormatDate(item.tanggalRegistrasi!);
            },
        },
        { 
            key: 'registerPerusahaan', 
            name: 'Perusahaan', 
            minWidth: 250, 
            maxWidth: 300, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return (
                    <>
                        <span>
                            {
                            item.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPerusahaan?.perusahaan?.nama}` :
                            `${item.registerPerusahaan?.perusahaan?.nama}`
                            }
                        </span><br />  
                        <span>
                            {
                                item.registerPerusahaan?.perusahaan?.id != undefined ?
                                invertParseNpwp(item.registerPerusahaan?.perusahaan?.id) : `-`
                            }
                        </span>
                    </>               
                );
            },
        },
        { 
            key: 'jenisDokumen', 
            name: 'Jenis dokumen', 
            minWidth: 200, 
            maxWidth: 200, 
            isResizable: true, 
            isRowHeader: true,
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return item.dokumen.nama;
            },
            // isPadded: true,
        },
        { 
            key: 'deskripsi', 
            name: 'Deskripsi dokumen', 
            minWidth: 180, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemRegisterDokumen) => {
                let doc = null;
                let konten = null;
                switch (item.dokumen.id) {
                    case '010101':
                        doc = item.dokumen as IDokumenAktaPendirian;
                        konten = 
                        <>
                            <span>Tanggal penerbitan : {flipFormatDate(doc.tanggal!)}</span><br /> 
                            <span>Notaris : {doc.namaNotaris}</span><br /> 
                            <span>Nomor akta : {doc.nomor}</span><br /> 
                            <span>Direktur : {doc.penanggungJawab?.person?.nama}</span>
                        </>; 
                        break;
                    case '010301':
                        doc = item.dokumen as IDokumenNibOss;
                        konten = 
                        <>
                            <span>Tanggal penerbitan : {flipFormatDate(doc.tanggal!)}</span><br /> 
                            <span>Nomor dokumen : {doc.nomor}</span>
                        </>; 
                        break;
                    default:
                        konten = '-';
                        break;
                }

                return konten;
            },
        },
        { 
            key: 'statusVerified', 
            name: 'Approved', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: false,            
            onRender: (item: IItemRegisterDokumen) => {
                return (
                    <span>{
                        item.statusVerified != undefined ? item.statusVerified == true ? 'Sudah':'Belum': null 
                    }</span>
                );
            },
        },
    ]);  
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false); 
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirRegisterDokumenOpen, {setTrue: showModalFormulirRegisterDokumen, setFalse: hideModalFormulirRegisterDokumen}] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IRegisterDokumen|undefined>(undefined);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [searchNamaPerusahaan, setSearchNamaPerusahaan] = useState<string|undefined>(undefined);
    const [searchNik, setSearchNik] = useState<string|undefined>(undefined);
    const searchNamaPerusahaanId = useId('searchNamaPerusahaan');
    const searchNikId = useId('searchNik');
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCount } = useGetJumlahDataRegisterDokumenQuery(queryFilters);
    const { data: postsRegisterDokumen, isLoading: isLoadingPosts } = useGetDaftarDataRegisterDokumenQuery(queryParams);  
    
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
                        setFormulirTitle('Add dokumen');
                        setModeForm('add');
                        showModalFormulirRegisterDokumen();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit dokumen');
                        setModeForm('edit');
                        showModalFormulirRegisterDokumen();
                        let dataTerpilih = cloneDeep(find(postsRegisterDokumen, (i) => i.id == selection.getSelection()[0].key));
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
                        setFormulirTitle('Hapus dokumen');
                        setModeForm('delete');
                        showModalFormulirRegisterDokumen();
                        let dataTerpilih = cloneDeep(find(postsRegisterDokumen, (i) => i.id == selection.getSelection()[0].key));
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection, postsRegisterDokumen]
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

    const _onContextualMenuFilterDismissed = useCallback(
        () => {
            setContextualMenuFilterProps(undefined);
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

    const _onChangeSearchNamaRegisterDokumen = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {            
            if(newValue!.length > 2) {
                setCurrentPage(1);
                setQueryFilters(
                    prev => {
                        let tmp = cloneDeep(prev);
                        let filters = cloneDeep(tmp.filters);
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                        
                        if(newValue != '') {
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'pegawai',
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'pegawai',
                                    value: newValue!
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
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                        
                        if(newValue != '') {
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'pegawai',
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'pegawai',
                                    value: newValue!
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
            } 
            else if(newValue!.length == 0) {
                _onClearSearchNamaRegisterDokumen();
            }
        },
        []
    );

    const _onSearchNamaRegisterDokumen = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'pegawai',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'pegawai',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'pegawai',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'pegawai',
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

    const _onClearSearchNamaRegisterDokumen= useCallback(
        () => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                    
                    
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

    const _onChangeSearchNamaPerusahaan = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
            setSearchNamaPerusahaan(newValue);          
            if(newValue!.length > 2) {
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
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'perusahaan',
                                    value: newValue!
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
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'perusahaan',
                                    value: newValue!
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
            }
            else if(newValue!.length == 0) {
                _onClearSearchNamaPerusahaan();
            }
        },
        []
    );

    const _onSearchNamaPerusahaan = useCallback(
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

    const _onClearSearchNamaPerusahaan= useCallback(
        () => {
            setCurrentPage(1);
            setSearchNamaPerusahaan(undefined);

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

    const _onChangeSearchNik = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
            setSearchNik(newValue);     
            if(newValue?.length as number >= 16) {
                _onSearchNik(newValue);
            }     
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

    const _onHandleResetFilter = useCallback(
        () => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number; 
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;  
                    
                    if(found != -1) {
                        filters?.splice(found, 1);          
                    }

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setSearchNamaPerusahaan(undefined);
            setSearchNik(undefined);
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
                                    placeholder="pencarian nama pegawai" 
                                    underlined={false} 
                                    onChange={_onChangeSearchNamaRegisterDokumen}
                                    onSearch={_onSearchNamaRegisterDokumen}
                                    onClear= {_onClearSearchNamaRegisterDokumen}
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
                                    postsRegisterDokumen != undefined ? postsRegisterDokumen?.map(
                                        (t) => (
                                            {key: t.id as string, ...t}
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
                            <Label htmlFor={searchNamaPerusahaanId}>Nama perusahaan</Label>
                            <SearchBox 
                                id={searchNamaPerusahaanId}
                                style={{width: 200}} 
                                disableAnimation
                                placeholder="nama sesuai ktp" 
                                underlined={false} 
                                onChange={_onChangeSearchNamaPerusahaan}
                                onSearch={_onSearchNamaPerusahaan}
                                onClear= {_onClearSearchNamaPerusahaan}
                                value={searchNamaPerusahaan ? searchNamaPerusahaan:''}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Label htmlFor={searchNikId}>NIK pegawai</Label>
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
                            <PrimaryButton 
                                style={{marginTop: 16, width: '100%'}}
                                text="Reset" 
                                onClick={_onHandleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }       
            { isModalFormulirRegisterDokumenOpen == true ?
                <FormulirRegisterDokumen
                    title={formulirTitle}
                    isModalOpen={isModalFormulirRegisterDokumenOpen}
                    showModal={showModalFormulirRegisterDokumen}
                    hideModal={hideModalFormulirRegisterDokumen}
                    mode={modeForm}
                    dataLama={dataLama}
                />:null
            } 
        </Stack>
    );
}