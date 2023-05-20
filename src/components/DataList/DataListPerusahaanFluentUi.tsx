import { FC, useCallback, useState } from "react";
import { IQueryParams, qFilters } from "../../features/config/query-params-slice";
import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps, IRenderFunction, Link, SearchBox, Stack, Text, mergeStyleSets } from "@fluentui/react";
import { IRegisterPerusahaan } from "../../features/perusahaan/register-perusahaan-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { baseRestAPIUrl } from "../../features/config/config";
import { ISuratArahan } from "../../features/dokumen/surat-arahan-api-slice";
import { IRekomendasiUKLUPL } from "../../features/dokumen/rekomendasi-ukl-upl-api-slice";
import { IDokumenNibOss } from "../../features/dokumen/dokumen-nib-oss-slice";
import cloneDeep from "lodash.clonedeep";
import { ILampiranSuratArahan } from "../../features/dokumen/lampiran-surat-arahan-api-slice";
import { IRekomendasiDPLH } from "../../features/dokumen/rekomendasi-dplh-api-slice";
import { IDokumenAktaPendirian } from "../../features/dokumen/dokumen-akta-pendirian-slice";

interface IDataListPerusahaanFluentUIProps {
    initSelectedFilters: IQueryParams;
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
    //local state
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'npwp', 
            name: 'Npwp', 
            fieldName: 'npwp', 
            minWidth: 130, 
            maxWidth: 130, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemRegisterPerusahaan) => {
                return item.perusahaan?.id;
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
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <span>
                        {
                        item.perusahaan?.pelakuUsaha !== undefined ?
                        `${item.perusahaan?.pelakuUsaha?.singkatan}. ${item.perusahaan?.nama}` :
                        `${item.perusahaan?.nama}`
                        }
                    </span>                 
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
                                    Telp: 
                                </label>
                                <label className={classNames.kontakCardLabel}>
                                    {`${item.perusahaan?.kontak!.telepone}`}
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
            maxWidth: 250, 
            isResizable: true,
            data: 'string',
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <span>
                        {
                            `${item.perusahaan?.alamat?.keterangan}`
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'dokumen', 
            name: 'Dokumen', 
            minWidth: 100, 
            isResizable: true,
            onRender: (item: IItemRegisterPerusahaan) => {
                return (
                    <>
                        <div className={classNames.dokumenMainTitle}>
                            Jumlah Dokumen : {item.perusahaan?.daftarRegisterDokumen?.length}
                        </div>                    
                        {
                            item.perusahaan?.daftarRegisterDokumen!.map((dataRegisterDokumen:IRegisterDokumen, index) => {
                                let dokumen = null;
                                if(dataRegisterDokumen.dokumen?.id == '010401') {
                                    dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                    return (
                                        <>
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
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                    dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                    return (
                                        <>
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
                                            
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenAktaPendirian;
                                    return (
                                        <>
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
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                    return (
                                        <>
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
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                    return (
                                        <>
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
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                    return (
                                        <>
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
                                        </>                                    
                                    );
                                }
                            })
                        }
                    </>
                );
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);

    const _onSearch = useCallback(
        (newValue) => {
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
                                />
                            </Stack.Item>
                        </Stack>
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item grow>

            </Stack.Item>
        </Stack>
    );
};