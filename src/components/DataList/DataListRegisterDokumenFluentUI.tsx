import { DefaultEffects, DirectionalHint, IColumn, IContextualMenuListProps,  IRenderFunction, Stack, mergeStyleSets, Text, SearchBox, ScrollablePane, DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IDetailsHeaderProps, Sticky, StickyPositionType, ContextualMenu, Callout, Label, ActionButton, IIconProps, PrimaryButton, CommandBar, ICommandBarItemProps, Toggle, ComboBox, IComboBox, IComboBoxOption, IComboBoxStyles} from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import { Pagination } from "../Pagination/pagination-fluent-ui";
import { useBoolean } from "@fluentui/react-hooks";
import { invertParseNpwp, utcFormatStringToDDMMYYYY } from "../../features/config/helper-function";
import { IQueryParamFilters, qFilters } from "../../features/entity/query-param-filters";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { useGetDaftarDataDokumenQuery, useGetDaftarDataRegisterDokumenQuery, useGetJumlahDataRegisterDokumenQuery } from "../../features/repository/service/sikoling-api-slice";
import find from "lodash.find";
import { FormulirRegisterDokumen } from "../Formulir/formulir-register-dokumen";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";

interface IDataListRegisterDokumenFluentUIProps {
    initSelectedFilters: IQueryParamFilters;
    title?: string;
};
type IItemRegisterDokumen = {key: string|null;} & Partial<IRegisterDokumen>;
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
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '80px',
    },
};
const comboBoxStyles: Partial<IComboBoxStyles> = {
    container: {
        width: '310px',
    },
    input: {
        minWidth: '200px',
    },
    optionsContainerWrapper: {
        maxWidth: '400px',
    },
};


export const DataListRegisterDokumenFluentUI: FC<IDataListRegisterDokumenFluentUIProps> = ({initSelectedFilters, title}) => {   
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
    
    //local state
    const [currentPage, setCurrentPage] = useState<number>(initSelectedFilters.pageNumber!);
    const [pageSize, setPageSize] = useState<number>(initSelectedFilters.pageSize!);
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        ...initSelectedFilters, pageNumber: currentPage, pageSize
    });
    const [queryFilters, setQueryFilters] = useState<qFilters>({filters: initSelectedFilters.filters}); 
    const [columns, setColumns] = useState<IColumn[]>([ 
        { 
            key: 'tanggalRegistrasi', 
            name: 'Tanggal', 
            minWidth: 80, 
            maxWidth: 80,             
            isRowHeader: true,
            isResizable: true,             
            isSortedDescending: false,
            isSorted: true,
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return utcFormatStringToDDMMYYYY(item.tanggalRegistrasi!);
            },
        },
        { 
            key: 'nama_perusahaan', 
            name: 'Perusahaan', 
            minWidth: 250, 
            maxWidth: 300, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return (
                    <>
                        <span>
                            {
                            item.registerPerusahaan?.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${item.registerPerusahaan?.perusahaan?.nama}` :
                            `${item.registerPerusahaan?.perusahaan?.nama}`
                            }
                        </span><br />  
                        <span>
                            {
                                item.registerPerusahaan?.perusahaan?.id != undefined ?
                                invertParseNpwp(item.registerPerusahaan?.perusahaan?.id) : `-`
                            }
                        </span>
                    </>               
                );
            },
        },
        { 
            key: 'nama_dokumen', 
            name: 'Jenis dokumen', 
            minWidth: 200, 
            maxWidth: 200, 
            isResizable: true, 
            onColumnClick: _onHandleColumnClick,
            onRender: (item: IItemRegisterDokumen) => {
                return item.dokumen?.nama;
            },
            // isPadded: true,
        },
        { 
            key: 'deskripsi', 
            name: 'Deskripsi dokumen', 
            minWidth: 180, 
            isResizable: true, 
            data: 'string',
            onRender: (item: IItemRegisterDokumen) => {
                let doc = null;
                let konten = null;
                switch (item.dokumen?.id) {
                    case '010101':
                        doc = item.dokumen as IDokumenAktaPendirian;
                        konten = 
                        <>
                            <span>Tanggal penerbitan : {utcFormatStringToDDMMYYYY(doc.tanggal!)}</span><br /> 
                            <span>Notaris : {doc.namaNotaris}</span><br /> 
                            <span>Nomor akta : {doc.nomor}</span><br /> 
                            <span>Direktur : {doc.penanggungJawab?.person?.nama}</span>
                        </>; 
                        break;
                    case '010301':
                        doc = item.dokumen as IDokumenNibOss;
                        konten = 
                        <>
                            <span>Tanggal penerbitan : {utcFormatStringToDDMMYYYY(doc.tanggal!)}</span><br /> 
                            <span>Nib : {doc.nomor}</span><br/>
                            <span>
                                Kbli : {
                                    doc.daftarKbli?.map((t,i) => {
                                        if(i == 0) {
                                            return t.kode;
                                        }
                                        else {
                                            return ', ' + t.kode;
                                        }
                                    })
                                }
                            </span>
                        </>; 
                        break;
                    default:
                        konten = '-';
                        break;
                }

                return konten;
            },
        },
        { 
            key: 'statusVerified', 
            name: 'Approved', 
            minWidth: 100, 
            maxWidth: 100, 
            isResizable: false,          
            onColumnClick: _onHandleColumnClick,  
            onRender: (item: IItemRegisterDokumen) => {
                return (
                    <span>{
                        item.statusVerified != undefined ? item.statusVerified == true ? 'Sudah':'Belum': null 
                    }</span>
                );
            },
        },
    ]);  
    const [isSelectedItem, setIsSelectedItem] = useState<boolean>(false); 
    const [isModalSelection, setIsModalSelection] = useState<boolean>(false);
    const [formulirTitle, setFormulirTitle] = useState<string|undefined>(undefined);
    const [modeForm, setModeForm] = useState<string|undefined>(undefined);
    const [isModalFormulirRegisterDokumenOpen, {setTrue: showModalFormulirRegisterDokumen, setFalse: hideModalFormulirRegisterDokumen}] = useBoolean(false);
    const [dataLama, setDataLama]= useState<IRegisterDokumen|undefined>(undefined);
    const [contextualMenuProps, setContextualMenuProps] = useState<any|undefined>(undefined);
    const [contextualMenuFilterProps, setContextualMenuFilterProps] = useState<any|undefined>(undefined);
    const [selectedKeyApproved, setSelectedKeyApproved] = useState<string|undefined|null>(undefined);
    const [selectedKeyDokumen, setSelectedKeyDokumen] = useState<string|undefined|null>(undefined);
    // rtk hook state
    const { data: postsCount, isLoading: isLoadingCount } = useGetJumlahDataRegisterDokumenQuery(queryFilters);
    const { data: postsRegisterDokumen, isLoading: isLoadingPosts } = useGetDaftarDataRegisterDokumenQuery(queryParams);  
    const { data: postsDokumen, isLoading: isLoadingPostsDokumen } = useGetDaftarDataDokumenQuery({
        pageNumber: 1,
        pageSize: 0,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    
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
                        setFormulirTitle('Add dokumen');
                        setModeForm('add');
                        showModalFormulirRegisterDokumen();
                        setDataLama(undefined);
                    }
                },
                { 
                    key: 'editItem', 
                    text: 'Edit', 
                    disabled: !isSelectedItem,
                    iconProps: { iconName: 'Edit' }, 
                    onClick: () => {
                        setFormulirTitle('Edit dokumen');
                        setModeForm('edit');
                        showModalFormulirRegisterDokumen();
                        let dataTerpilih = cloneDeep(find(postsRegisterDokumen, (i) => i.id == selection.getSelection()[0].key));
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
                        setFormulirTitle('Hapus dokumen');
                        setModeForm('delete');
                        showModalFormulirRegisterDokumen();
                        let dataTerpilih = cloneDeep(find(postsRegisterDokumen, (i) => i.id == selection.getSelection()[0].key));
                        setDataLama(dataTerpilih);
                    }
                },
            ];
        }, 
        [isSelectedItem, selection, postsRegisterDokumen]
    );

    const optionsDokumen: IComboBoxOption[]|undefined = useMemo(
        () => (
            postsDokumen?.map((item):IComboBoxOption => {
                return {
                key: item.id!,
                text: item.nama!,                
                styles: {
                    optionText: {
                      overflow: 'visible',
                      whiteSpace: 'normal',
                    },
                },
                data: item
                };
            })
        ),
        [postsDokumen]
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

    const _onChangeModalSelection = useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => {            
            if(selection.getSelectedCount() > 0) {
                selection.toggleKeySelected(selection.getSelection()[0].key as string);
            }
            
            setIsModalSelection(checked!);  
        },
        [selection]
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
            if(newValue!.length == 0) {
                _onClearSearchNamaPerusahaan();
            }
        },
        []
    );

    const _onSearchNamaPerusahaan = useCallback(
        (newValue) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama_perusahaan'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nama_perusahaan',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nama_perusahaan',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama_perusahaan'}) as number;     
                    
                    if(newValue != '') {
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nama_perusahaan',
                                value: newValue
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nama_perusahaan',
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

    const _onClearSearchNamaPerusahaan= useCallback(
        () => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama_perusahaan'}) as number;  
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama_perusahaan'}) as number;     
                    
                    
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

    const _onHandleOnChangeApproved = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerified'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'statusVerified',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'statusVerified',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerified'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'statusVerified',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'statusVerified',
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

    const _onHandleOnChangeDokumen = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            setCurrentPage(1);

            setQueryFilters(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'jenisDokumen'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'jenisDokumen',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'jenisDokumen',
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'jenisDokumen'}) as number;   
                    
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'jenisDokumen',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'jenisDokumen',
                            value: option?.key as string
                        })
                    }                    
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;            
                    return tmp;
                }
            );

            setSelectedKeyDokumen(option?.key as string);
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerified'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'jenisDokumen'}) as number;
                    
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
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'statusVerified'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    found = filters?.findIndex((obj) => {return obj.fieldName == 'jenisDokumen'}) as number;
                    
                    if(found != -1) {
                        filters?.splice(found, 1);
                    }

                    tmp.pageNumber = 1;
                    tmp.filters = filters;

                    return tmp;
                }
            );                

            setSelectedKeyApproved(undefined);
            setSelectedKeyDokumen(undefined);
        },
        []
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
                                    placeholder="pencarian nama perusahaan" 
                                    underlined={false} 
                                    onChange={_onChangeSearchNamaPerusahaan}
                                    onSearch={_onSearchNamaPerusahaan}
                                    onClear= {_onClearSearchNamaPerusahaan}
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
                                    postsRegisterDokumen != undefined ? postsRegisterDokumen?.map(
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
            {contextualMenuFilterProps && 
                <Callout {...contextualMenuFilterProps} style={{padding: 16}}> 
                    <Stack>
                        <Stack.Item>
                            <ComboBox
                                label="Jenis dokumen"
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsDokumen != undefined ? optionsDokumen:[]}
                                selectedKey={selectedKeyDokumen == undefined ? null:selectedKeyDokumen}
                                useComboBoxAsMenuWidth={false}     
                                onChange={_onHandleOnChangeDokumen}
                                styles={comboBoxStyles}
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
                                styles={comboBoxStyles}
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
            {isModalFormulirRegisterDokumenOpen && (
                <FormulirRegisterDokumen
                    title={formulirTitle}
                    isModalOpen={true}
                    showModal={showModalFormulirRegisterDokumen}
                    hideModal={hideModalFormulirRegisterDokumen}
                    mode={modeForm}
                    dataLama={dataLama}/>
            )}          
        </Stack>
    );
}   