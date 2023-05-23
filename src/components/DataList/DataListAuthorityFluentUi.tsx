import { IIconProps, Stack, mergeStyleSets, Text, SearchBox, ActionButton, ScrollablePane, DetailsList, IColumn, DirectionalHint, IContextualMenuListProps, IRenderFunction, FontIcon, mergeStyles, DetailsListLayoutMode, SelectionMode, Sticky, StickyPositionType, IDetailsHeaderProps, ContextualMenu } from "@fluentui/react";
import { FC, useCallback, useState } from "react";
import { IQueryParams, qFilters } from "../../features/config/query-params-slice";
import { IAuthor } from "../../features/security/author-slice";
import cloneDeep from "lodash.clonedeep";
import { useGetAllAuthorisasiQuery, useGetTotalCountAuthorisasiQuery } from "../../features/security/authorization-api-slice";
import omit from "lodash.omit";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { flipFormatDate } from "../../features/config/config";

interface IDataListAuthorityUIProps {
    initSelectedFilters: IQueryParams;
    title?: string;
};
type IItemAuthority = {key: string|null;} & Partial<IAuthor>;
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

export const DataListAuthorityFluentUI: FC<IDataListAuthorityUIProps> = ({initSelectedFilters, title}) => { 

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
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
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
                return flipFormatDate(item.tanggal as string);
            }
        },
        { 
            key: 'user_name', 
            name: 'User', 
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
            key: 'person', 
            name: 'Identitas', 
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
                            item.person.alamat.desa != undefined ? `, ${item.person.alamat.desa}`:null:null
                            }
                            {
                            item.person.alamat != undefined ? 
                            item.person.alamat.kecamatan != undefined ? `, ${item.person.alamat.kecamatan}`:null:null
                            }
                            {
                            item.person.alamat != undefined ? 
                            item.person.alamat.kecamatan != undefined ? `, ${item.person.alamat.kecamatan}`:null:null
                            }
                        </span><br />
                        <span>
                            {
                            item.person.alamat != undefined ? 
                            item.person.alamat.kabupaten != undefined ? `, ${item.person.alamat.kabupaten}`:null:null
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
            name: 'Status user', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: true,
            onColumnClick: _onHandleColumnClick,
            data: 'string',
            onRender: (item: IItemAuthority) => {
                return (
                    <span>
                        {
                            item.statusInternal != undefined ? item.statusInternal == true ? 'Petugas':'Pemrakarsa':null
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'is_verified', 
            name: 'Verifikasi', 
            minWidth: 40, 
            maxWidth: 40, 
            isResizable: false,            
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemAuthority) => {
                return (
                    <span>{
                        item.verified != undefined ? 
                        item.verified == true ? 
                        <FontIcon aria-label="True" iconName="CheckMark" className={classNames.deepGreen} /> :
                        <FontIcon aria-label="False" iconName="CompassNW" className={classNames.deepRed} /> : null 
                    }</span>
                );
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);

    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCountPosts } = useGetTotalCountAuthorisasiQuery
    (queryFilters);
    const { data: postsAuthority, isLoading: isLoadingPostsAuthority } = useGetAllAuthorisasiQuery(queryParams);
    

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

    const _onSearch = useCallback(
        (newValue) => {
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
                    
                    tmp.filters = filters;             
                    return tmp;
                }
            );
        },
        []
    );

    const _onClearSearch= useCallback(
        () => {
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

    const _onHandleButtonFilterClick = useCallback(
        (ev: React.MouseEvent<HTMLElement>): void => {  
            // setContextualMenuFilterProps({         
            //     target: ev.currentTarget as HTMLElement,
            //     directionalHint: DirectionalHint.bottomRightEdge,
            //     gapSpace: 2,
            //     isBeakVisible: true,
            //     onDismiss: _onContextualMenuFilterDismissed,                  
            // });
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
                                    placeholder="pencarian user name" 
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
                                    Filter
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
                                    postsAuthority != undefined ? postsAuthority?.map(
                                        (t) => (
                                            {key: t.id as string, ...omit(t, ['id'])}
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
        </Stack>
    );
}