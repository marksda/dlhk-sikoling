import { FC, useCallback, useMemo, useState } from "react";
import { ActionButton, Callout, ComboBox, CommandBar, ContextualMenu, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, IComboBox, IComboBoxOption, ICommandBarItemProps, IContextualMenuListProps, IDetailsHeaderProps, IIconProps, IRenderFunction, PrimaryButton, ScrollablePane, SearchBox, Selection, SelectionMode, Stack, Sticky, StickyPositionType, Text, Toggle, mergeStyleSets } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IKecamatan } from "../../features/entity/kecamatan";
import { useBoolean } from "@fluentui/react-hooks";
import { FormulirKecamatan } from "../Formulir/formulir-kecamatan"; 
import find from "lodash.find";
import { useGetDaftarDataKabupatenQuery, useGetDaftarDataKecamatanQuery, useGetDaftarDataPropinsiQuery, useGetJumlahDataKecamatanQuery } from "../../features/repository/service/sikoling-api-slice";


interface IDataKecamatanFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemKecamatan = {key: string|null;} & Partial<IKecamatan>;
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
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};
const filterIcon: IIconProps = { iconName: 'Filter' };

export const DataListKecamatanFluentUI: FC<IDataKecamatanFluentUIProps> = ({initSelectedFilters, title}) => {  
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

    // local state
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirKecamatanOpen, { setTrue: showModalFormulirKecamatan, setFalse: hideModalFormulirKecamatan }] = useBoolean(false);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [dataLama, setDataLama]= useState<IKecamatan|undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters});   
    const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(undefined);
    const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(undefined);
    const [queryPropinsiParams, setQueryPropinsiParams] = useState<IQueryParamFilters>({
        pageNumber: 1,
        pageSize: 100,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    const [queryKabupatenParams, setQueryKabupatenParams] = useState<IQueryParamFilters>({
        pageNumber: 1,
        pageSize: 100,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'id', 
            name: 'Id', 
            fieldName: 'id', 
            minWidth: 60, 
            maxWidth: 60, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: false,
            isSorted: true,
            onRender: (item: IItemKecamatan) => {
                return item.key;
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
            isPadded: true,
            onRender: (item: IItemKecamatan) => {
                return item.nama;
            }
        },
        { 
            key: 'kabupaten', 
            name: 'Kabupaten', 
            minWidth: 250, 
            maxWidth: 300, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            isPadded: true,
            onRender: (item: IItemKecamatan) => {
                return item.kabupaten?.nama;
            }
        },
        { 
            key: 'propinsi', 
            name: 'Propinsi', 
            minWidth: 100, 
            isResizable: true,
            isPadded: true,
            onRender: (item: IItemKecamatan) => {
                return item.kabupaten?.propinsi?.nama;
            },
        },
    ]);
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCountPosts } = useGetJumlahDataKecamatanQuery(queryFilters);
    const { data: postsKecamatan, isLoading: isLoadingPostsKecamatan } = useGetDaftarDataKecamatanQuery(queryParams);
    const { data: postsPropinsi, isLoading: isLoadingPostsPropinsi } = useGetDaftarDataPropinsiQuery(queryPropinsiParams)
    const { data: postsKabupaten, isLoading: isLoadingPostsKabupaten } = useGetDaftarDataKabupatenQuery(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});

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

    const optionsPropinsi: IComboBoxOption[]|undefined = useMemo(
        () => (
          postsPropinsi?.map((item):IComboBoxOption => {
                  return {
                    key: item.id!,
                    text: item.nama!,
                    data: item
                  };
                })
        ),
        [postsPropinsi]
    );

    const optionsKabupaten: IComboBoxOption[]|undefined = useMemo(
        () => (
          postsKabupaten?.map((item):IComboBoxOption => {
                  return {
                    key: item.id!,
                    text: item.nama!,
                    data: item
                  };
                })
        ),
        [postsKabupaten]
    );
    
    const itemsBar: ICommandBarItemProps[] = useMemo(
        () => {            
            return [
                { 
                    key: 'newItem', 
                    text: 'Add', 
                    iconProps: { iconName: 'Add' }, 
                    onClick: () => {
                        setFormulirTitle('Add kecamatan');
                        setModeForm('add');
                        showModalFormulirKecamatan();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit kecamatan');
                        setModeForm('edit');
                        showModalFormulirKecamatan();
                        let dataTerpilih: IKecamatan = find(postsKecamatan, (i: IKecamatan) => i.id == selection.getSelection()[0].key) as IKecamatan;
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
                        setFormulirTitle('Hapus kecamatan');
                        setModeForm('delete');
                        showModalFormulirKecamatan();
                        let dataTerpilih: IKecamatan = find(postsKecamatan, (i: IKecamatan) => i.id == selection.getSelection()[0].key) as IKecamatan;
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection, postsKecamatan]
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

    const _onChangeModalSelection = useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => {            
            if(selection.getSelectedCount() > 0) {
                selection.toggleKeySelected(selection.getSelection()[0].key as string);
            }
            
            setIsModalSelection(checked!);  
        },
        [selection]
    );

    const _onHandleResetFilter = useCallback(
        () => {
            _resetKabupaten();
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;
                    
                   
                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;

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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;

                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    if(found != -1) {
                        filters?.splice(found, 1);  
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                
            
            setSelectedKeyPropinsi(undefined);
        },
        [postsPropinsi]
    );

    const _resetKabupaten = useCallback(
        () => {
            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;   
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;   
                    
                    if(found != -1) {                        
                        filters?.splice(found, 1); 
                    }   
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKeyKabupaten(undefined);
        },
        []
    );

    const _onHandleOnChangePropinsi = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            let item = cloneDeep(postsPropinsi?.at(index!));
            _resetKabupaten();

            setCurrentPage(1);

            setQueryKabupatenParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;     
                                                        
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'propinsi',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'propinsi',
                            value: option?.key as string
                        })
                    }
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;             
                    return tmp;
                }
            );

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'propinsi',
                            value: item?.id as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'propinsi',
                            value: item?.id as string
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'propinsi',
                            value: item?.id as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'propinsi',
                            value: item?.id as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKeyPropinsi(option?.key as string);
        },
        [postsPropinsi]
    );   

    const _onHandleOnChangeKabupaten = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            let item = cloneDeep(postsKabupaten?.at(index!));
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'kabupaten',
                            value: item?.id as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'kabupaten',
                            value: item?.id as string
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'kabupaten',
                            value: item?.id as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'kabupaten',
                            value: item?.id as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKeyKabupaten(option?.key as string);
        },
        [postsKabupaten]
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
                            <Stack.Item >
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
                                    postsKecamatan != undefined ? postsKecamatan?.map(
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
            {
                contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps} style={{padding: 16, width: 250}}> 
                    <Stack>
                        <Stack.Item>
                            <ComboBox
                                label="Propinsi"
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsPropinsi != undefined ? optionsPropinsi:[]}
                                selectedKey={selectedKeyPropinsi == undefined ? null:selectedKeyPropinsi}
                                useComboBoxAsMenuWidth={true}     
                                onChange={_onHandleOnChangePropinsi}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <ComboBox
                                label="Kabupaten"
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsKabupaten != undefined ? optionsKabupaten:[]}
                                selectedKey={selectedKeyKabupaten == undefined ? null:selectedKeyKabupaten}
                                useComboBoxAsMenuWidth={true}     
                                onChange={_onHandleOnChangeKabupaten}
                                disabled={selectedKeyPropinsi == undefined ? true:false}
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
            { isModalFormulirKecamatanOpen == true ?
                <FormulirKecamatan
                    title={formulirTitle}
                    isModalOpen={isModalFormulirKecamatanOpen}
                    showModal={showModalFormulirKecamatan}
                    hideModal={hideModalFormulirKecamatan}
                    mode={modeForm}
                    dataLama={dataLama}
                />:null
            }
        </Stack>
    );
};