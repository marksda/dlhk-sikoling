import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps, IIconProps, IRenderFunction, Stack, mergeStyleSets, Text, SearchBox, ScrollablePane, DetailsList, DetailsListLayoutMode, SelectionMode, IDetailsHeaderProps, Sticky, StickyPositionType, ContextualMenu, ActionButton, Callout, Dropdown, PrimaryButton, IDropdownOption, CommandBar, Selection, ICommandBarItemProps, Toggle } from "@fluentui/react";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IPelakuUsaha } from "../../features/entity/pelaku-usaha";
import { useGetDaftarDataPelakuUsahaQuery, useGetDaftarDataSkalaUsahaQuery, useGetJumlahDataPelakuUsahaQuery } from "../../features/repository/service/sikoling-api-slice";
import { useBoolean } from "@fluentui/react-hooks";
import find from "lodash.find";
import { FormulirPelakuUsaha } from "../Formulir/formulir-pelaku-usaha";

interface IDataListPelakuUsahaFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemPelakuUsaha = {key: string|null;} & Partial<IPelakuUsaha>;
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
const filterIcon: IIconProps = { iconName: 'Filter'};
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};

export const DataListPelakuUsahaFluentUI: FC<IDataListPelakuUsahaFluentUIProps> = ({initSelectedFilters, title}) => {   
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
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [isModalFormulirPelakuUsahaOpen, { setTrue: showModalFormulirPelakuUsaha, setFalse: hideModalFormulirPelakuUsaha}] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IPelakuUsaha|undefined>(undefined);    
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'id', 
            name: 'Id', 
            fieldName: 'id', 
            minWidth: 50, 
            maxWidth: 50, 
            isRowHeader: true,
            isResizable: false,
            onColumnClick: _onHandleColumnClick,
            isPadded: true,
            isSortedDescending: false,
            isSorted: true,
            onRender: (item: IItemPelakuUsaha) => {
                return item.id;
            }
        },
        { 
            key: 'nama', 
            name: 'Nama', 
            minWidth: 200, 
            maxWidth: 300,
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemPelakuUsaha) => {
                return item.nama;
            },
            isPadded: true,
        },
        { 
            key: 'singkatan', 
            name: 'Singkatan', 
            minWidth: 100, 
            maxWidth: 200,
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemPelakuUsaha) => {
                return item.singkatan;
            },
            isPadded: true,
        },
        { 
            key: 'kategori_pelaku_usaha', 
            name: 'Kategori', 
            minWidth: 100, 
            maxWidth: 150,
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemPelakuUsaha) => {
                return item.kategoriPelakuUsaha?.nama;
            },
            isPadded: true,
        },
        { 
            key: 'skala_usaha', 
            name: 'Skala usaha', 
            minWidth: 100, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemPelakuUsaha) => {
                return item.kategoriPelakuUsaha?.skalaUsaha?.singkatan;
            },
            isPadded: true,
        },
    ]);   
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [selectedSkalaUsaha, setSelectedSkalaUsaha] = useState<IDropdownOption|null|undefined>(null);
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCount } = useGetJumlahDataPelakuUsahaQuery(queryFilters);
    const { data: postsPelakuUsaha, isLoading: isLoadingPosts } = useGetDaftarDataPelakuUsahaQuery(queryParams); 
    const { data: postsSkalaUsaha, isLoading: isLoadingPostsSkalaUsaha } = useGetDaftarDataSkalaUsahaQuery(queryParams);    
    
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
                        setFormulirTitle('Add pelaku usaha');
                        setModeForm('add');
                        showModalFormulirPelakuUsaha();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit pelaku usaha');
                        setModeForm('edit');
                        showModalFormulirPelakuUsaha();
                        let dataTerpilih = find(postsPelakuUsaha, (i) => i.id == selection.getSelection()[0].key);
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
                        showModalFormulirPelakuUsaha();
                        let dataTerpilih = find(postsPelakuUsaha, (i) => i.id == selection.getSelection()[0].key);
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection, postsPelakuUsaha]
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

    const _onChangeSkalaUsaha = useCallback(
        (event: FormEvent<HTMLDivElement>, item: IDropdownOption<any>|undefined) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'skala_usaha'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'skala_usaha',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'skala_usaha',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'skala_usaha'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'skala_usaha',
                            value: item?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'skala_usaha',
                            value: item?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedSkalaUsaha(item);
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'skala_usaha'}) as number;
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'skala_usaha'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                
            
            setSelectedSkalaUsaha(null);
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
                                    postsPelakuUsaha != undefined ? postsPelakuUsaha?.map(
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
            {
                contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps} style={{padding: 16}}> 
                    <Stack>
                        <Stack.Item>
                            <Dropdown 
                                label="Skala usaha"
                                style={{minWidth: 200}}
                                dropdownWidth="auto"
                                placeholder="--Pilih--"
                                options={
                                    postsSkalaUsaha != undefined ? postsSkalaUsaha?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.singkatan}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedSkalaUsaha ? selectedSkalaUsaha.key : null}
                                onChange={_onChangeSkalaUsaha}
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
            {isModalFormulirPelakuUsahaOpen && (
                <FormulirPelakuUsaha
                    title={formulirTitle}
                    isModalOpen={isModalFormulirPelakuUsahaOpen}
                    hideModal={hideModalFormulirPelakuUsaha}
                    mode={modeForm}
                    dataLama={dataLama}
                />
            )}
        </Stack>
    );
}