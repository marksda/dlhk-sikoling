import { FC, useCallback, useMemo, useState } from "react";
import { CommandBar, ContextualMenu, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, ICommandBarItemProps, IContextualMenuListProps, IDetailsHeaderProps, IRenderFunction, ScrollablePane, SearchBox, Selection, SelectionMode, Stack, Sticky, StickyPositionType, Text, mergeStyleSets } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { useGetDaftarHakAksesQuery, useGetTotalCountHakAksesQuery } from "../../features/repository/service/hak-akses-api-slice";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IHakAkses } from "../../features/entity/hak-akses";
import { useBoolean } from "@fluentui/react-hooks";
import { FormulirHakAkses } from "../Formulir/formulir-hak-akses";


interface IDataListHakAksesFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemHakAkses = {key: string|null;} & Partial<IHakAkses>;
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

export const DataListHakAksesFluentUI: FC<IDataListHakAksesFluentUIProps> = ({initSelectedFilters, title}) => {  
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

    // local state
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirHakAksesOpen, { setTrue: showModalFormulirHakAkses, setFalse: hideModalFormulirHakAkses }] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IHakAkses|undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters});   
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'id', 
            name: 'Id', 
            fieldName: 'id', 
            minWidth: 32, 
            maxWidth: 32, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: false,
            isSorted: true,
            onRender: (item: IItemHakAkses) => {
                return item.key;
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
            isPadded: true,
            onRender: (item: IItemHakAkses) => {
                return item.nama;
            }
        },
        { 
            key: 'keterangan', 
            name: 'Keterangan', 
            minWidth: 100, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            isPadded: true,
            onRender: (item: IItemHakAkses) => {
                return item.keterangan;
            }
        },
    ]);
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCountPosts } = useGetTotalCountHakAksesQuery
    (queryFilters);
    const { data: postsHakAkses, isLoading: isLoadingPostsHakAkses } = useGetDaftarHakAksesQuery(queryParams);

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
                selectionMode: SelectionMode.single,
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
                        showModalFormulirHakAkses();
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
                        showModalFormulirHakAkses();
                        let dataTerpilih = cloneDeep(selection.getSelection()[0]);
                        delete dataTerpilih.key;
                        setDataLama(dataTerpilih as IHakAkses);
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
                        showModalFormulirHakAkses();
                        let dataTerpilih = cloneDeep(selection.getSelection()[0]);
                        delete dataTerpilih.key;
                        setDataLama(dataTerpilih as IHakAkses);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection]
    );

    // const _getKey = useCallback(
    //     (item: any, index?: number): string => {
    //         return item.key;
    //     },
    //     []
    // );

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
                                <CommandBar items={itemsBar} style={{minWidth: 250}}/>
                            </Stack.Item>
                            <Stack.Item>
                                <SearchBox 
                                    style={{width: 250}} 
                                    placeholder="pencarian nama hak akses" 
                                    underlined={false} 
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
                                    postsHakAkses != undefined ? postsHakAkses?.map(
                                        (t) => (
                                            {key: t.id as string, ...omit(t, ['id'])}
                                        )
                                    ) : []
                                }
                                compact={false}
                                columns={columns}
                                setKey="none"
                                // getKey={_getKey}
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
            { isModalFormulirHakAksesOpen == true ?
                <FormulirHakAkses
                    title={formulirTitle}
                    isModalOpen={isModalFormulirHakAksesOpen}
                    showModal={showModalFormulirHakAkses}
                    hideModal={hideModalFormulirHakAkses}
                    mode={modeForm}
                    dataLama={dataLama}
                />:null
            }
        </Stack>
    );
};