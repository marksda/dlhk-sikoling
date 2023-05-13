import { ActionButton, Callout, ContextualMenu, DatePicker, DayOfWeek, DetailsList, DetailsListLayoutMode, Dropdown, IColumn, IDropdownOption, IIconProps, ScrollablePane, SearchBox, SelectionMode, Stack, mergeStyleSets } from "@fluentui/react";
import { FC, useCallback, useState } from "react";
import { IQueryParams } from "../../../features/config/query-params-slice";
import { IFlowLogPermohonan, useGetAllFlowLogQuery } from "../../../features/log/flow-log-api-slice";
import { DayPickerIndonesiaStrings, flipFormatDate, onFormatDate, onFormatDateUtc } from "../../../features/config/config";
import cloneDeep from "lodash.clonedeep";
import omit from "lodash.omit";
import { Pagination } from "../../Pagination/pagination-fluent-ui";


type IItemFlowLogPermohonan = {key: string|null;} & Partial<IFlowLogPermohonan>;
const stackTokens = { childrenGap: 8 };
const classNames = mergeStyleSets({
    container: {
        width: "100%",
        position: "relative",
        minHeight: 200,
    },
    gridContainer: {
        height: window.innerHeight - 230,
        overflowY: "auto",
        overflowX: "auto",
        position: "relative",
    },
});
const filterIcon: IIconProps = { iconName: 'Filter' };

export const DataListFlowLogFluentUI: FC = () => {   
    const handleOnColumnClick = useCallback(
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

    const handleButtonFilterClick = useCallback(
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
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(50);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);    
    const [selectedPengirim, setSelectedPengirim] = useState<IDropdownOption|null|undefined>(null);
    const [selectedPenerima, setSelectedPenerima] = useState<IDropdownOption|null|undefined>(null);
    
    const [queryParams, setQueryParams] = useState<IQueryParams>({
        pageNumber: currentPage,
        pageSize: pageSize,
        filters: [
            {
                fieldName: 'posisi_tahap_pemberkasan_penerima',
                value: '1'
            }
        ],
        sortOrders: [
            {
                fieldName: 'tanggal_registrasi',
                value: 'DESC'
            },
        ],
    });
    const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
    const [columns, setColumns] = useState<IColumn[]>([    
        { 
            key: 'tanggal', 
            name: 'Tanggal', 
            fieldName: 'tanggal', 
            minWidth: 100, 
            maxWidth: 100, 
            isRowHeader: true,
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            isPadded: true,
            isSortedDescending: true,
            isSorted: true,
            onRender: (item: IItemFlowLogPermohonan) => {
                return flipFormatDate(item.tanggal as string);
            }
        },
        { 
            key: 'perusahaan', 
            name: 'Pemrakarsa', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <div>
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}` : `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}`
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.id !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.id}`: null
                            }
                        </span><br />
                        <span>
                            {
                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                            `${item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama}`: null
                            }
                            {
                                item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.desa?.nama !== undefined ?
                                `, ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.alamat?.kecamatan?.nama}`: null
                            }
                        </span>
                    </div>
                    
                );
            },
            isPadded: true,
        },
        { 
            key: 'kategori_log', 
            name: 'Jenis log', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                if(item.kategoriFlowLog?.id === '1') {
                    return (
                        <>
                            <span style={{color: 'green'}}>
                                {
                                    `${item.kategoriFlowLog?.nama} : ${item.registerPermohonan?.kategoriPermohonan?.nama?.toLowerCase()}`
                                } 
                            </span><br/>
                            <span>
                                <b>
                                    {
                                        `${
                                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha != undefined ?
                                            item.registerPermohonan?.registerPerusahaan?.perusahaan?.pelakuUsaha.singkatan : null
                                        }. ${item.registerPermohonan?.registerPerusahaan?.perusahaan?.nama}`
                                    }
                                </b>
                            </span><br/>
                        </>
                    ); 
                }
                else {
                    return (
                        <span>
                            {item.kategoriFlowLog?.nama}
                        </span>
                    ); 
                }
            },
            isPadded: true,
        },
        { 
            key: 'posisi_tahap_pemberkasan_pengirim', 
            name: 'Pengirim', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            data: 'string',
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <span>
                        {
                            item.pengirimBerkas?.nama
                        }
                    </span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'posisi_tahap_pemberkasan_penerima', 
            name: 'Penerima', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onColumnClick: handleOnColumnClick,
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <span>{item.penerimaBerkas?.nama}</span>
                );
            },
            isPadded: true,
        },
        { 
            key: 'keterangan', 
            name: 'Keterangan', 
            minWidth: 100, 
            maxWidth: 200, 
            isResizable: true,
            onRender: (item: IItemFlowLogPermohonan) => {
                return (
                    <>
                    <span>
                        *** {item.penerimaBerkas?.keterangan} ***
                    </span><br />
                    <span>
                        {item.statusFlowLog?.nama}
                        {item.keterangan != undefined ? ` : ${item.keterangan}` : null}
                    </span>
                    </>
                ); 
            },
            isPadded: true,
        },
    ]);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    // rtk hook state
    const { data: posts, isLoading } = useGetAllFlowLogQuery(queryParams);

    const _getKey = useCallback(
        (item: any, index?: number): string => {
            return item.key;
        },
        []
    );

    const _onSearch = useCallback(
        (newValue) => {
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

    const handleSelectedDate = useCallback(
        (date) => {
            let tanggalTerpilih = onFormatDateUtc(date);

            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'tanggal'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'tanggal',
                            value: tanggalTerpilih
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'tanggal',
                            value: tanggalTerpilih
                        });
                    }                    
                    
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedDate(date);
        },
        []
    );

    const handlePageSizeChange = useCallback(
        (v: number) => {
            setQueryParams(
                prev => {
                    let tmp = cloneDeep(prev);                    
                    tmp.pageSize = v;            
                    return tmp;
                }
            );
            setPageSize(v);
        },
        []
    );

    return (
        <>
            <Stack grow verticalFill tokens={stackTokens} className={classNames.container}>
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
                        <Stack.Item>
                            <ActionButton 
                                iconProps={filterIcon} 
                                onClick={handleButtonFilterClick}
                            > 
                                Filter
                            </ActionButton>       
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
                <Stack.Item grow className={classNames.gridContainer}>
                    <ScrollablePane scrollbarVisibility="auto">
                        <DetailsList
                            items={
                                posts != undefined ? posts?.map(
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
                        />
                    </ScrollablePane>
                </Stack.Item>
                <Stack.Item>
                    <Pagination 
                        currentPage={currentPage}
                        pageSize={pageSize}
                        siblingCount={1}
                        totalCount={100}
                        onPageChange={page => setCurrentPage(page)}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </Stack.Item>
            </Stack>
            {contextualMenuProps && <ContextualMenu {...contextualMenuProps} />}
            {
                contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps} style={{padding: 16}}> 
                    <Stack>
                        <Stack.Item>
                            <DatePicker
                                label="Tanggal"
                                firstDayOfWeek={firstDayOfWeek}
                                placeholder="Pilih tanggal..."
                                ariaLabel="Pilih tanggal"
                                strings={DayPickerIndonesiaStrings}
                                formatDate={onFormatDate}
                                onSelectDate={handleSelectedDate}
                                value={selectedDate}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Jenis log"
                                placeholder="--Pilih--"
                                options={
                                    postsJenisLog != undefined ? postsJenisLog?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedJenisPermohonan ? selectedJenisPermohonan.key : null}
                                onChange={onChangeJenisPermohonan}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <Dropdown 
                                label="Pengirim"
                                placeholder="--Pilih--"
                                options={
                                    postsPosisiTahapPemberkasan != undefined ? postsPosisiTahapPemberkasan?.map(
                                        (t) => ({
                                            key: t.id!, 
                                            text: `${t.nama}`
                                        })
                                    ) : []
                                }
                                selectedKey={selectedPengirim ? selectedPengirim.key : null}
                                onChange={onChangePengirim}
                            />
                        </Stack.Item>
                        <Stack.Item>
                            <PrimaryButton 
                                style={{width: 200, marginTop: 16}}
                                text="Reset" 
                                onClick={handleResetFilter}
                            />
                        </Stack.Item>
                    </Stack>
                </Callout>                
            }
        </>
    );
};