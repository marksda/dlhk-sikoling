import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { ActionButton, Callout, CommandBar, ContextualMenu, DefaultEffects, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, ICommandBarItemProps, IContextualMenuListProps, IDetailsHeaderProps, IIconProps, IRenderFunction, Label, Link, MaskedTextField, PrimaryButton, ScrollablePane, SearchBox, SelectionMode, Stack, Sticky, StickyPositionType, Text, mergeStyleSets } from "@fluentui/react";
import { baseRestAPIUrl, flipFormatDate } from "../../features/config/config";
import { ISuratArahan } from "../../features/dokumen/surat-arahan-api-slice";
import { IRekomendasiUKLUPL } from "../../features/dokumen/rekomendasi-ukl-upl-api-slice";
import cloneDeep from "lodash.clonedeep";
import { ILampiranSuratArahan } from "../../features/dokumen/lampiran-surat-arahan-api-slice";
import { IRekomendasiDPLH } from "../../features/dokumen/rekomendasi-dplh-api-slice";
import { useGetDaftarDataQuery as getDaftarRegisterPerusahaan, useGetJumlahDataQuery as getJumlahDaftarRegisterPerusahaan  } from "../../features/repository/service/register-perusahaan-api-slice";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useBoolean } from "@fluentui/react-hooks";
import { FormulirPerusahaan } from "../Formulir/formulir-perusahaan";
import { invertParseNpwp, parseNpwp } from "../../features/config/helper-function";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";

interface IDataListPerusahaanFluentUIProps {
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
const barStackTokens = { childrenGap: 48 };
const filterIcon: IIconProps = { iconName: 'Filter' };

export const DataListPerusahaanFluentUI: FC<IDataListPerusahaanFluentUIProps> = ({initSelectedFilters, title}) => { 

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
    const [npwpTerparsing, setNpwpTerparsing] = useState<string|undefined>(undefined);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [isModalFormulirPerusahaanOpen, { setTrue: showModalFormulirPerusahaan, setFalse: hideModalFormulirPerusahaan }] = useBoolean(false);
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
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemRegisterPerusahaan) => {
                return flipFormatDate(item.tanggalRegistrasi as string);
            }
        },
        { 
            key: 'nama', 
            name: 'Nama', 
            minWidth: 100, 
            maxWidth: 200, 
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
            minWidth: 100, 
            maxWidth: 200, 
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
            key: 'dokumen', 
            name: 'Dokumen', 
            minWidth: 200, 
            maxWidth: 200,
            isResizable: true,
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <>
                        <div className={classNames.dokumenMainTitle}>
                            Jumlah Dokumen : {
                            item.perusahaan?.daftarRegisterDokumen != undefined ?
                            item.perusahaan?.daftarRegisterDokumen?.length : 0
                            }
                        </div>                    
                        {
                            item.perusahaan?.daftarRegisterDokumen != undefined ?
                            item.perusahaan?.daftarRegisterDokumen!.map((dataRegisterDokumen:IRegisterDokumen, index) => {
                                let dokumen = null;
                                if(dataRegisterDokumen.dokumen?.id == '010401') {
                                    dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span >Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </div>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                    dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                            
                                        </div>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenAktaPendirian;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span>Nomor: {dokumen?.nomor}</span><br />
                                                <span>notaris: {dokumen?.namaNotaris}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </div>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span>Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </div>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span>Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </div>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                    return (
                                        <div key={dokumen.id}>
                                            <div className={classNames.dokumenTitle}>{index+1}. {dokumen?.nama}</div>
                                            <div className={classNames.containerItemDok}>
                                                <span>Nomor: {dokumen?.nomor}</span><br />
                                                <span>perihal: {dokumen?.tanggal}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </div>                                    
                                    );
                                }
                            }) : null
                        }
                    </>
                );
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: postsPerusahaan, isLoading: isLoadingPostsPerusahaan } = getDaftarRegisterPerusahaan(queryParams);
    const { data: postsCountPerusahaan, isLoading: isLoadingCountPosts } = getJumlahDaftarRegisterPerusahaan(queryFilters);

    const itemsBar: ICommandBarItemProps[] = useMemo(
        () => {
            // const CoachmarkButtonWrapper: IComponentAs<ICommandBarItemProps> = (p: IComponentAsProps<ICommandBarItemProps>) => {
            //   return (
            //     <CoachmarkCommandBarButton {...p} isCoachmarkVisible={isCoachmarkVisible} onDismiss={onDismissCoachmark} />
            //   );
            // };
        
            return [
                { 
                    key: 'newItem', 
                    text: 'Add', 
                    iconProps: { iconName: 'Add' }, 
                    onClick: () => {
                        setFormulirTitle('Add pemrakarsa');
                        showModalFormulirPerusahaan();
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: true,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit pemrakarsa');
                        showModalFormulirPerusahaan();
                    }
                },
            ];
        }, 
        []
    );

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
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

            setNpwpTerparsing(undefined);
        },
        []
    );

    return (
        <Stack grow verticalFill>
            <Stack.Item>
                <Stack horizontal grow horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item align="center" style={{paddingLeft: 16}}>
                        <Text variant="xLarge">{title}</Text> 
                    </Stack.Item>                        
                    <Stack.Item>
                        <Stack horizontal horizontalAlign="end" verticalAlign="center">
                            <Stack.Item>
                                <CommandBar items={itemsBar}/>
                            </Stack.Item>
                            <Stack.Item>
                                <SearchBox 
                                    style={{width: 300}} 
                                    placeholder="pencarian nama" 
                                    underlined={false} 
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
                                    postsPerusahaan != undefined ? postsPerusahaan?.map(
                                        (t) => (
                                            {key: t.id as string, ...omit(t, ['id'])}
                                        )
                                    ) : []
                                }
                                compact={false}
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
                            totalCount={postsCountPerusahaan == undefined ? 50:postsCountPerusahaan }
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
                            <PrimaryButton 
                                style={{marginTop: 16, width: '100%'}}
                                text="Reset" 
                                onClick={_onHandleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }
            <FormulirPerusahaan 
                title={formulirTitle}
                isModalOpen={isModalFormulirPerusahaanOpen}
                showModal={showModalFormulirPerusahaan}
                hideModal={hideModalFormulirPerusahaan}
            />
        </Stack>
    );
};