import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { ActionButton, Callout, CommandBar, ContextualMenu, DefaultEffects, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, ICommandBarItemProps, IContextualMenuListProps, IDetailsHeaderProps, IIconProps, IRenderFunction, Selection, MaskedTextField, PrimaryButton, ScrollablePane, SearchBox, SelectionMode, Stack, Sticky, StickyPositionType, Text, Toggle, mergeStyleSets, ComboBox, IComboBox, IComboBoxOption } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useBoolean } from "@fluentui/react-hooks";
import { FormulirRegisterPerusahaan } from "../Formulir/formulir-register-perusahaan";
import { invertParseNpwp, parseNpwp, utcFormatStringToDDMMYYYY } from "../../features/config/helper-function";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { useGetDaftarDataRegisterPerusahaanQuery, useGetJumlahDataRegisterPerusahaanQuery } from "../../features/repository/service/sikoling-api-slice";
import find from "lodash.find";
import { useAppSelector } from "../../app/hooks";

interface IDataListRegisterPerusahaanFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemRegisterPerusahaan = {key: string|null;} & Partial<IRegisterPerusahaan>;
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
    dokumenMainTitle: {
        marginBottom: 4,
        fontWeight: 'bold',
    },
    dokumenTitle: {
        fontWeight: 'bold',
    },
    containerItemDok: {
        marginLeft: 12,
        marginBottom: 4,
    },
});
const stackTokens = { childrenGap: 8 };
const filterIcon: IIconProps = { iconName: 'Filter' };
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListRegisterPerusahaanFluentUI: FC<IDataListRegisterPerusahaanFluentUIProps> = ({initSelectedFilters, title}) => { 
    const token = useAppSelector((state) => state.token);

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
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    // const [selectedKeyItem, setSelectedKeyItem] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirRegisterPerusahaanOpen, {setTrue: showModalFormulirRegisterPerusahaan, setFalse: hideModalFormulirRegisterPerusahaan}] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IRegisterPerusahaan|undefined>(undefined);
    const [npwpTerparsing, setNpwpTerparsing] = useState<string|undefined>(undefined);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal_registrasi', 
            name: 'Tgl. registrasi', 
            fieldName: 'tanggal_registrasi', 
            minWidth: 100, 
            maxWidth: 100, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: initSelectedFilters.sortOrders![0].value == 'DESC' ? true:false,
            isSorted: true,
            onRender: (item: IItemRegisterPerusahaan) => {
                return utcFormatStringToDDMMYYYY(item.tanggalRegistrasi!);
            }
        },
        { 
            key: 'nama', 
            name: 'Nama', 
            minWidth: 250, 
            maxWidth: 300, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <>
                    <span>
                        {
                        item.perusahaan?.pelakuUsaha !== undefined ?
                        `${item.perusahaan?.pelakuUsaha?.singkatan}. ${item.perusahaan?.nama}` :
                        `${item.perusahaan?.nama}`
                        }
                    </span><br />  
                    <span>
                        {
                            item.perusahaan?.id != undefined ?
                            invertParseNpwp(item.perusahaan?.id) : `-`
                        }
                    </span>
                    </>               
                );
            },
            isPadded: true,
        },
        { 
            key: 'kontak', 
            name: 'Kontak', 
            minWidth: 200, 
            maxWidth: 250, 
            isResizable: true, 
            data: 'string',
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <>
                        <p className={classNames.kontakContainer}>
                            {`Email: ${item.perusahaan?.kontak?.email}`}<br />
                            <span style={{display: 'flex'}}>
                                <label className={classNames.kontakLabel}>
                                    Telp: {`${item.perusahaan?.kontak!.telepone}`}
                                </label>
                            </span>
                            {`Fax: ${item.perusahaan?.kontak!.fax}`}
                        </p>
                    </>
                ); 
            },
            isPadded: true,
        },
        { 
            key: 'alamat', 
            name: 'Alamat', 
            minWidth: 250, 
            isResizable: true,
            data: 'string',
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <>
                        <span>
                            {
                            item.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.alamat.keterangan != undefined ? item.perusahaan?.alamat.keterangan:null:null
                            }
                            {
                            item.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.alamat.desa != undefined ? `, ${item.perusahaan?.alamat.desa.nama}`:null:null
                            }                            
                        </span><br />
                        <span>
                            {
                                item.perusahaan?.alamat != undefined ? 
                                item.perusahaan?.alamat.kecamatan != undefined ? `${item.perusahaan?.alamat.kecamatan.nama}`:null:null
                            }
                            {
                            item.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.alamat.kabupaten != undefined ? `, ${item.perusahaan?.alamat.kabupaten.nama}`:null:null
                            }
                        </span>
                        <span>
                            {
                            item.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.alamat.propinsi != undefined ? `, ${item.perusahaan?.alamat.propinsi.nama}`:null:null
                            }
                        </span>
                    </>
                );
            },
            isPadded: true,
        },
        { 
            key: 'statusVerifikasi', 
            name: 'Approved', 
            minWidth: 40, 
            maxWidth: 40, 
            isResizable: false,            
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <span>{
                        item.statusVerifikasi != undefined ? item.statusVerifikasi == true ? 'Sudah':'Belum': null 
                    }</span>
                );
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [selectedKeyApproved, setSelectedKeyApproved] = useState<string|undefined|null>(undefined);
    // rtk hook state
    const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsRegisterPerusahaan } = useGetDaftarDataRegisterPerusahaanQuery(queryParams);
    const { data: postsJumlahDataRegisterPerusahaan, isLoading: isLoadingCountPosts } = useGetJumlahDataRegisterPerusahaanQuery(queryFilters);

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
            // const dataTerpilih = selection.getSelection()[0] != undefined ? 
            //     cloneDeep(find(postsRegisterPerusahaan, (i) => i.id == selectedKeyItem)) as IRegisterPerusahaan : undefined;
            // if(dataTerpilih == undefined) {
            //     return [
            //         { 
            //             key: 'newItem', 
            //             text: 'Add', 
            //             iconProps: { iconName: 'Add' }, 
            //             onClick: () => {
            //                 setFormulirTitle('Add register perusahaan');
            //                 setModeForm('add');
            //                 showModalFormulirRegisterPerusahaan();
            //                 setDataLama(undefined);
            //             }
            //         },
            //         { 
            //             key: 'editItem', 
            //             text: 'Edit', 
            //             disabled: true,
            //             iconProps: { iconName: 'Edit' },
            //         },
            //         { 
            //             key: 'deleteItem', 
            //             text: 'Hapus', 
            //             renderedInOverflow: false,
            //             disabled: true,
            //             iconProps: { iconName: 'Delete' }, 
            //         },
            //     ];
            // }
            // else {
            //     let hasil = null;                
            //     switch (token.hakAkses) {
            //         case 'Administrator':
            //             hasil = [
            //                 { 
            //                     key: 'newItem', 
            //                     text: 'Add', 
            //                     iconProps: { iconName: 'Add' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Add register perusahaan');
            //                         setModeForm('add');
            //                         showModalFormulirRegisterPerusahaan();
            //                         setDataLama(undefined);
            //                     }
            //                 },
            //                 { 
            //                     key: 'editItem', 
            //                     text: 'Edit', 
            //                     disabled: !selectedKeyItem,
            //                     iconProps: { iconName: 'Edit' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Edit register perusahaan');
            //                         setModeForm('edit');
            //                         showModalFormulirRegisterPerusahaan();                       
            //                         if(dataTerpilih.kreator == undefined) {
            //                             dataTerpilih.kreator = null;
            //                         }
            //                         if(dataTerpilih.verifikator == undefined) {
            //                             dataTerpilih.verifikator = null;
            //                         }
            //                         if(dataTerpilih.tanggalRegistrasi == undefined) {
            //                             dataTerpilih.tanggalRegistrasi = null;
            //                         }
            //                         setDataLama(dataTerpilih);
            //                         selection.toggleKeySelected(selection.getSelection()[0].key as string);
            //                     }
            //                 },
            //                 { 
            //                     key: 'deleteItem', 
            //                     text: 'Hapus', 
            //                     renderedInOverflow: false,
            //                     disabled: !selectedKeyItem,
            //                     iconProps: { iconName: 'Delete' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Hapus pegawai');
            //                         setModeForm('delete');
            //                         showModalFormulirRegisterPerusahaan();
            //                         if(dataTerpilih.kreator == undefined) {
            //                             dataTerpilih.kreator = null;
            //                         }
            //                         if(dataTerpilih.verifikator == undefined) {
            //                             dataTerpilih.verifikator = null;
            //                         }
            //                         if(dataTerpilih.tanggalRegistrasi == undefined) {
            //                             dataTerpilih.tanggalRegistrasi = null;
            //                         }
            //                         setDataLama(dataTerpilih);
            //                     }
            //                 },
            //             ];
            //             break;                
            //         default:
            //             hasil = [
            //                 { 
            //                     key: 'newItem', 
            //                     text: 'Add', 
            //                     iconProps: { iconName: 'Add' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Add register perusahaan');
            //                         setModeForm('add');
            //                         showModalFormulirRegisterPerusahaan();
            //                         setDataLama(undefined);
            //                     }
            //                 },
            //                 { 
            //                     key: 'editItem', 
            //                     text: 'Edit', 
            //                     disabled: dataTerpilih.statusVerifikasi == true ? true : !selectedKeyItem,
            //                     iconProps: { iconName: 'Edit' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Edit register perusahaan');
            //                         setModeForm('edit');
            //                         showModalFormulirRegisterPerusahaan();                     
            //                         if(dataTerpilih.kreator == undefined) {
            //                             dataTerpilih.kreator = null;
            //                         }
            //                         if(dataTerpilih.verifikator == undefined) {
            //                             dataTerpilih.verifikator = null;
            //                         }
            //                         if(dataTerpilih.tanggalRegistrasi == undefined) {
            //                             dataTerpilih.tanggalRegistrasi = null;
            //                         }
            //                         setDataLama(dataTerpilih);
            //                         selection.toggleKeySelected(selection.getSelection()[0].key as string);
            //                     }
            //                 },
            //                 { 
            //                     key: 'deleteItem', 
            //                     text: 'Hapus', 
            //                     renderedInOverflow: false,
            //                     disabled: dataTerpilih.statusVerifikasi == true ? true : !selectedKeyItem,
            //                     iconProps: { iconName: 'Delete' }, 
            //                     onClick: () => {
            //                         setFormulirTitle('Hapus pegawai');
            //                         setModeForm('delete');
            //                         showModalFormulirRegisterPerusahaan();

            //                         if(dataTerpilih.kreator == undefined) {
            //                             dataTerpilih.kreator = null;
            //                         }
            //                         if(dataTerpilih.verifikator == undefined) {
            //                             dataTerpilih.verifikator = null;
            //                         }
            //                         if(dataTerpilih.tanggalRegistrasi == undefined) {
            //                             dataTerpilih.tanggalRegistrasi = null;
            //                         }
            //                         setDataLama(dataTerpilih);
            //                     }
            //                 },
            //             ];
            //             break;
            //     }

            //     return hasil;
            // }

            let hasil = null; 
            const dataTerpilih = isSelectedItem ? cloneDeep(find(postsRegisterPerusahaan, (i) => i.id == selection.getSelection()[0].key)) : undefined;
            switch (token.hakAkses) {
                case 'Administrator':
                    hasil = [
                        { 
                            key: 'newItem', 
                            text: 'Add', 
                            iconProps: { iconName: 'Add' }, 
                            onClick: () => {
                                setFormulirTitle('Add register perusahaan');
                                setModeForm('add');
                                showModalFormulirRegisterPerusahaan();
                                setDataLama(undefined);
                            }
                        },
                        { 
                            key: 'editItem', 
                            text: 'Edit', 
                            disabled: !isSelectedItem,
                            iconProps: { iconName: 'Edit' }, 
                            onClick: () => {
                                setFormulirTitle('Edit register perusahaan');
                                setModeForm('edit');
                                showModalFormulirRegisterPerusahaan();                       
                                if(dataTerpilih!.kreator == undefined) {
                                    dataTerpilih!.kreator = null;
                                }
                                if(dataTerpilih!.verifikator == undefined) {
                                    dataTerpilih!.verifikator = null;
                                }
                                if(dataTerpilih!.tanggalRegistrasi == undefined) {
                                    dataTerpilih!.tanggalRegistrasi = null;
                                }
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
                                setFormulirTitle('Hapus pegawai');
                                setModeForm('delete');
                                showModalFormulirRegisterPerusahaan();
                                if(dataTerpilih!.kreator == undefined) {
                                    dataTerpilih!.kreator = null;
                                }
                                if(dataTerpilih!.verifikator == undefined) {
                                    dataTerpilih!.verifikator = null;
                                }
                                if(dataTerpilih!.tanggalRegistrasi == undefined) {
                                    dataTerpilih!.tanggalRegistrasi = null;
                                }
                                setDataLama(dataTerpilih);
                            }
                        },
                    ];
                    break;                
                default:
                    hasil = [
                        { 
                            key: 'newItem', 
                            text: 'Add', 
                            iconProps: { iconName: 'Add' }, 
                            onClick: () => {
                                setFormulirTitle('Add register perusahaan');
                                setModeForm('add');
                                showModalFormulirRegisterPerusahaan();
                                setDataLama(undefined);
                            }
                        },
                        { 
                            key: 'editItem', 
                            text: 'Edit', 
                            disabled: dataTerpilih?.statusVerifikasi == true ? true : !isSelectedItem,
                            iconProps: { iconName: 'Edit' }, 
                            onClick: () => {
                                setFormulirTitle('Edit register perusahaan');
                                setModeForm('edit');
                                showModalFormulirRegisterPerusahaan();                     
                                if(dataTerpilih!.kreator == undefined) {
                                    dataTerpilih!.kreator = null;
                                }
                                if(dataTerpilih!.verifikator == undefined) {
                                    dataTerpilih!.verifikator = null;
                                }
                                if(dataTerpilih!.tanggalRegistrasi == undefined) {
                                    dataTerpilih!.tanggalRegistrasi = null;
                                }
                                setDataLama(dataTerpilih);
                                selection.toggleKeySelected(selection.getSelection()[0].key as string);
                            }
                        },
                        { 
                            key: 'deleteItem', 
                            text: 'Hapus', 
                            renderedInOverflow: false,
                            disabled: dataTerpilih?.statusVerifikasi == true ? true : !isSelectedItem,
                            iconProps: { iconName: 'Delete' }, 
                            onClick: () => {
                                setFormulirTitle('Hapus pegawai');
                                setModeForm('delete');
                                showModalFormulirRegisterPerusahaan();

                                if(dataTerpilih!.kreator == undefined) {
                                    dataTerpilih!.kreator = null;
                                }
                                if(dataTerpilih!.verifikator == undefined) {
                                    dataTerpilih!.verifikator = null;
                                }
                                if(dataTerpilih!.tanggalRegistrasi == undefined) {
                                    dataTerpilih!.tanggalRegistrasi = null;
                                }
                                setDataLama(dataTerpilih);
                            }
                        },
                    ];
                    break;
            }

            return hasil;
        }, 
        [isSelectedItem, selection, postsRegisterPerusahaan, token]
    );

    const _onChangeSearchNama = useCallback(
        (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {            
            if(newValue!.length > 2) {
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
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'nama',
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
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                        
                        if(newValue != '') {
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'nama',
                                    value: newValue!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'nama',
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
                _onClearSearch();
            }
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

    const _onClearSearch= useCallback(
        () => {
            setCurrentPage(1);

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

    const _onChangeSearchNpwpMasked = useCallback(
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
            let hasil = parseNpwp(newValue as string);
            setNpwpTerparsing(hasil);
            if (hasil.length == 15) {
                setCurrentPage(1);

                setQueryFilters(
                    prev => {
                        let tmp = cloneDeep(prev);
                        let filters = cloneDeep(tmp.filters);
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;     
                        
                        if(newValue != '') {
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'npwp',
                                    value: hasil
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'npwp',
                                    value: hasil
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
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;     
                        
                        if(newValue != '') {
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'npwp',
                                    value: hasil
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'npwp',
                                    value: hasil
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
            else if(hasil.length == 0) {
                setCurrentPage(1);

                setQueryFilters(
                    prev => {
                        let tmp = cloneDeep(prev);
                        let filters = cloneDeep(tmp.filters);
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;
                        
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
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;
                        
                        if(found != -1) {
                            filters?.splice(found, 1);
                        }

                        tmp.pageNumber = 1;
                        tmp.filters = filters;

                        return tmp;
                    }
                );         
            }
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerifikasi'}) as number;
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'npwp'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }
                    
                    found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerifikasi'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setNpwpTerparsing(undefined);
            setSelectedKeyApproved(undefined);
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

    const _onHandleOnChangeApproved = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerifikasi'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'statusVerifikasi',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'statusVerifikasi',
                            value: option?.key as string
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerifikasi'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'statusVerifikasi',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'statusVerifikasi',
                            value: option?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKeyApproved(option?.key as string);
        },
        []
    );

    return (
        <Stack grow verticalFill>
            <Stack.Item style={{marginRight: 16}}>
                <Stack horizontal grow horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item style={{paddingLeft: 16}}align="center" >
                        <Text variant="xLarge">{title}</Text> 
                    </Stack.Item>                        
                    <Stack.Item align="center">
                        <Stack horizontal horizontalAlign="end" verticalAlign="center" style={{height: 44}}>
                            {
                                isModalSelection && (
                                    <Stack.Item>
                                        <CommandBar items={itemsBar}/>
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
                                    placeholder="pencarian nama" 
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
                                    postsRegisterPerusahaan != undefined ? postsRegisterPerusahaan?.map(
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
                            totalCount={postsJumlahDataRegisterPerusahaan == undefined ? 50:postsJumlahDataRegisterPerusahaan }
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
                            <MaskedTextField 
                                label="Npwp perusahaan"
                                mask="99.999.999.9-999.999"
                                value={npwpTerparsing}
                                onChange={_onChangeSearchNpwpMasked}
                            />     
                        </Stack.Item>                        
                        <Stack.Item>
                            <ComboBox
                                label="Approved"
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={[{ key: 'false', text: 'Belum'}, { key: 'true', text: 'Sudah'}]}
                                selectedKey={selectedKeyApproved == undefined ? null:selectedKeyApproved}
                                useComboBoxAsMenuWidth={true}     
                                onChange={_onHandleOnChangeApproved}
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
            { isModalFormulirRegisterPerusahaanOpen == true ?
                <FormulirRegisterPerusahaan 
                    title={formulirTitle}
                    isModalOpen={isModalFormulirRegisterPerusahaanOpen}
                    hideModal={hideModalFormulirRegisterPerusahaan}
                    mode={modeForm}
                    dataLama={dataLama}
                />:null
            }
        </Stack>
    );
};