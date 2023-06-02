import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps,  IRenderFunction, Stack, mergeStyleSets, Text, SearchBox, ScrollablePane, DetailsList, DetailsListLayoutMode, SelectionMode, IDetailsHeaderProps, Sticky, StickyPositionType, ContextualMenu, Callout, Label, ActionButton, IIconProps, PrimaryButton} from "@fluentui/react";
import { IQueryParams, qFilters } from "../../features/config/query-params-slice";
import { FC, useCallback, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useGetAllDaftarPegawaiByFilterQuery, useGetTotalCountPegawaiQuery } from "../../features/pegawai/pegawai-api-slice";
import { useId } from "@fluentui/react-hooks";
import { IDokumen } from "../../features/dokumen/dokumen-slice";

interface IDataListDokumenFluentUIProps {
    initSelectedFilters: IQueryParams;
    title?: string;
};
type IItemDokumen = {key: string|null;} & Partial<IDokumen>;
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

export const DataListDokumenFluentUI: FC<IDataListDokumenFluentUIProps> = ({initSelectedFilters, title}) => {   
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
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'id', 
            name: 'Id', 
            fieldName: 'id', 
            minWidth: 210, 
            maxWidth: 210, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            onRender: (item: IItemDokumen) => {
                return item.id;
            }
        },
        { 
            key: 'nama', 
            name: 'Nama', 
            minWidth: 300, 
            maxWidth: 300,
            isResizable: true,             
            isSortedDescending: false,
            isSorted: true,
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemDokumen) => {
                return (
                    <>
                        <span>{item.person?.nama}</span><br />
                        {
                            item.person?.nik !== undefined ? 
                            <span>{item.person?.nik}</span>:null
                        }
                        <p className={classNames.kontakContainer}>
                            <span>Email:
                            {
                                item.person?.kontak?.email != undefined ?
                                ` ${item.person?.kontak?.email}`:' -'
                            }
                            </span><br />
                            <span style={{display: 'flex'}}>
                                <label className={classNames.kontakLabel}>
                                    Telp: 
                                {
                                    item.person?.kontak?.telepone != undefined ?
                                    `${item.person?.kontak?.telepone}`:`-`
                                }
                                </label>
                            </span>
                        </p>
                    </>                    
                ); 
            },
            isPadded: true,
        },
        { 
            key: 'jabatan', 
            name: 'Jabatan', 
            minWidth: 180, 
            maxWidth: 180,
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemDokumen) => {
                return item.jabatan?.nama;
            },
            isPadded: true,
        },
        { 
            key: 'perusahaan', 
            name: 'Perusahaan', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemDokumen) => {
                return (
                    <>
                        <span>
                            {
                            item.perusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.perusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.perusahaan?.perusahaan?.nama}` :
                            `${item.perusahaan?.perusahaan?.nama}`
                            }
                        </span><br />  
                        <span>
                            {
                                item.perusahaan?.perusahaan?.id != undefined ?
                                item.perusahaan?.perusahaan?.id : `-`
                            }
                        </span><br />
                        <span>
                            {
                            item.perusahaan?.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.perusahaan?.alamat.keterangan != undefined ? item.perusahaan?.perusahaan?.alamat.keterangan:null:null
                            }
                            {
                            item.perusahaan?.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.perusahaan?.alamat.desa != undefined ? `, ${item.perusahaan?.perusahaan?.alamat.desa.nama}`:null:null
                            }
                        </span><br />
                        <span>
                            {
                            item.perusahaan?.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.perusahaan?.alamat.kecamatan != undefined ? item.perusahaan?.perusahaan?.alamat.kecamatan.nama:null:null
                            }
                            {
                            item.perusahaan?.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.perusahaan?.alamat.kabupaten != undefined ? `, ${item.perusahaan?.perusahaan?.alamat.kabupaten.nama}`:null:null
                            }
                        </span>
                        <span>
                            {
                            item.perusahaan?.perusahaan?.alamat != undefined ? 
                            item.perusahaan?.perusahaan?.alamat.propinsi != undefined ? `, ${item.perusahaan?.perusahaan?.alamat.propinsi.nama}`:null:null
                            }
                        </span>
                    </>               
                );
            },
            isPadded: true,
        },
    ]);   
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [searchNamaPerusahaan, setSearchNamaPerusahaan] = useState<string|undefined>(undefined);
    const [searchNik, setSearchNik] = useState<string|undefined>(undefined);
    const searchNamaPerusahaanId = useId('searchNamaPerusahaan');
    const searchNikId = useId('searchNik');
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCount } = useGetTotalCountPegawaiQuery(queryFilters);
    const { data: postsPegawai, isLoading: isLoadingPosts } = useGetAllDaftarPegawaiByFilterQuery(queryParams);   
    

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                    
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

    const _onClearSearchNama= useCallback(
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


    return (
        <Stack grow verticalFill>
            <Stack.Item style={{marginTop: 2}}>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                    <Stack.Item style={{paddingLeft: 16}}>
                        <Text variant="xLarge">{title}</Text> 
                    </Stack.Item>
                    <Stack.Item>
                        <Stack horizontal horizontalAlign="end" verticalAlign="center">
                            <Stack.Item>
                                <SearchBox 
                                    style={{width: 300}} 
                                    placeholder="pencarian nama pegawai" 
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
                                    postsPegawai != undefined ? postsPegawai?.map(
                                        (t) => (
                                            {key: t.id as string, ...t}
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
                            totalCount={postsCount == undefined ? 50:postsCount }
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
                            <Label htmlFor={searchNamaPerusahaanId}>Nama</Label>
                            <SearchBox 
                                id={searchNamaPerusahaanId}
                                style={{width: 200}} 
                                disableAnimation
                                placeholder="nama sesuai ktp" 
                                underlined={false} 
                                onChange={_onChangeSearchNamaPerusahaan}
                                onSearch={_onSearchNama}
                                onClear= {_onClearSearchNama}
                                value={searchNamaPerusahaan ? searchNamaPerusahaan:''}
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
                            <PrimaryButton 
                                style={{marginTop: 16, width: '100%'}}
                                text="Reset" 
                                onClick={_onHandleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }        
        </Stack>
    );
}