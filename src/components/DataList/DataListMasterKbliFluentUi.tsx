import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps, IIconProps, IRenderFunction, Stack, mergeStyleSets, Text, SearchBox, ScrollablePane, DetailsList, DetailsListLayoutMode, SelectionMode, IDetailsHeaderProps, Sticky, StickyPositionType, ContextualMenu, CommandBar, Selection, ICommandBarItemProps, Toggle } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IKbli } from "../../features/entity/kbli";
import { useGetDaftarDataKbliQuery, useGetJumlahDataKbliQuery } from "../../features/repository/service/sikoling-api-slice";
import { useBoolean } from "@fluentui/react-hooks";
import find from "lodash.find";
import { FormulirMasterKbli } from "../Formulir/formulir-master-kbli";
// import { useGetDaftarDataQuery as getDaftarKbli, useGetJumlahDataQuery as getJumlahKbli} from "../../features/repository/service/kbli-api-slice";

interface IDataListMasterKbliFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemKbli = {key: string|null;} & Partial<IKbli>;
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
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListMasterKbliFluentUI: FC<IDataListMasterKbliFluentUIProps> = ({initSelectedFilters, title}) => {   
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
    
    //local state
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirKbliOpen, { setTrue: showModalFormulirKbli, setFalse: hideModalFormulirKbli}] = useBoolean(false);
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [dataLama, setDataLama]= useState<IKbli|undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'kode', 
            name: 'Kode', 
            fieldName: 'kode', 
            minWidth: 50, 
            maxWidth: 50, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: false,
            isSorted: true,
            onRender: (item: IItemKbli) => {
                return item.kode;
            }
        },
        { 
            key: 'nama', 
            name: 'Nama', 
            minWidth: 250, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemKbli) => {
                return item.nama;
            },
            isPadded: true,
        },
        { 
            key: 'kategori', 
            name: 'Kategori', 
            minWidth: 100, 
            maxWidth: 100,
            isResizable: true,
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemKbli) => {
                return item.kategori;
            },
            isPadded: true,
        },
    ]);   
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCount } = useGetJumlahDataKbliQuery(queryFilters);
    const { data: postsKbli, isLoading: isLoadingPosts } = useGetDaftarDataKbliQuery(queryParams);    

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
                        setFormulirTitle('Add master kbli');
                        setModeForm('add');
                        showModalFormulirKbli();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit master kbli');
                        setModeForm('edit');
                        showModalFormulirKbli();                        
                        let dataTerpilih = find(postsKbli, (i) => i.kode == selection.getSelection()[0].key);
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
                        showModalFormulirKbli();
                        let dataTerpilih = find(postsKbli, (i) => i.kode == selection.getSelection()[0].key);
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection, postsKbli]
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

    const _onSearch = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kode'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'kode',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'kode',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kode'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'kode',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'kode',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kode'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kode'}) as number;     
                    
                    
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

    return (
        <Stack grow verticalFill style={{marginTop: 2}}>
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
                                    placeholder="pencarian kode" 
                                    underlined={false} 
                                    onChange={_onChangeSearchNama}
                                    onSearch={_onSearch}
                                    onClear= {_onClearSearch}
                                />
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
                                    postsKbli != undefined ? postsKbli?.map(
                                        (t) => (
                                            {key: t.kode as string, ...t}
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
            {isModalFormulirKbliOpen && (
                <FormulirMasterKbli
                    title={formulirTitle}
                    isModalOpen={isModalFormulirKbliOpen}
                    hideModal={hideModalFormulirKbli}
                    mode={modeForm}
                    dataLama={dataLama}
                />
            )}
        </Stack>
    );
}