import { CommandBar, DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IDetailsHeaderProps, IObjectWithKey, IRenderFunction, IStackTokens, mergeStyles, Selection, SelectionMode, Stack } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import omit from "lodash.omit";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { IKontak } from "../../features/person/person-slice";
import { useDeletePerusahaanMutation, useGetAllPerusahaanQuery, useGetPerusahaanByIdPersonQuery } from "../../features/perusahaan/perusahaan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ISubFormDetailPerusahaanProps } from "../FormulirPerusahaanFormHook/InterfacesPerusahaan";

const _columns = [
    { key: 'c1', name: 'Npwp', fieldName: 'npwp', minWidth: 130, maxWidth: 130, isResizable: true },
    { key: 'c2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Kontak', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Alamat', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
];

// export interface IListItemPerusahaan {
//     key: string|undefined;
//     npwp: string|undefined;
//     nama: string|undefined;
//     kontak: IKontak|undefined;
//     alamat: string|undefined;
// };

export type IListItemPerusahaan = {key: string|null;} & Omit<IPerusahaan, "id">;

const onRenderDetailsHeader = (headerProps?:IDetailsHeaderProps, defaultRender?: IRenderFunction<IDetailsHeaderProps>) => {
    if (!headerProps || !defaultRender) {
        return null;
    }
    return defaultRender({
        ...headerProps,
        styles: {
            root: {                
                // paddingTop: 0,                
                // borderTop : '1px solid rgb(237, 235, 233)',
            },
        },
    })
};

// const _selection = new Selection({
//     onSelectionChanged: () => {
//         // setSelectionDetails(getSelection());
//         console.log()
//     }
// });

// const getSelection = ():string => {
//     const selectionCount = _selection.getSelectedCount();

//     switch (selectionCount) {
//     case 0:
//         return 'No items selected';
//     case 1:
//         return '1 item selected: ' + (_selection.getSelection()[0] as IListItemPerusahaan).nama;
//     default:
//         return `${selectionCount} items selected`;
//     }
// };

const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPerusahaanFluentUI: FC<ISubFormDetailPerusahaanProps> = ({showModalAddPerusahaan, hideModalAddModalPerusahaan}) => {
    //redux global state
    const token = useAppSelector(state => state.token);

    // local state
    const [dataPerusahaan, setDataPerusahaan] = useState<IListItemPerusahaan[]>([]);
    const [selectedItems, setSelectedItems] = useState<IObjectWithKey[]>([]);

    
    //rtk query perusahaan variable hook
    const { data: daftarPerusahaan = [], error: errorFetchDataPerusahaan,  isFetching: isFetchingDaftarPerusahaan, isError } = useGetPerusahaanByIdPersonQuery(token.userId as string);
    const [deletePerusahaan, { isLoading: isDeleting }] = useDeletePerusahaanMutation();

    const _items: ICommandBarItemProps[] = useMemo(
        () => ([
            {
                key: 'add',
                text: 'Tambah',
                iconProps: { iconName: 'Add' },
                onClick: showModalAddPerusahaan,
                disabled: selectedItems.length > 0 ? true:false,
            },
            {
                key: 'edit',
                text: 'Ubah',
                iconProps: { iconName: 'Edit' },
                onClick: () => console.log('Share'),
                disabled: selectedItems.length == 1 ? false:true,
            },
            {
                key: 'delete',
                text: 'Hapus',
                iconProps: { iconName: 'Delete' },
                onClick: async () => {
                    let i = 0;
                    for(i; i< selectedItems.length; i++) {
                        await deletePerusahaan(selectedItems[i].key as string);
                    }                    
                },
                disabled: selectedItems.length > 0 ? false:true,
            }
        ]),
        [selectedItems]
    );

    const _selection = useMemo(
        () => new Selection(
            {
                onSelectionChanged: () => {
                    setSelectedItems(_selection.getSelection());
                },
                selectionMode: SelectionMode.multiple,
            }
        ),
        []
    );

    //deteksi error koneksi dengan backend
    // useEffect(
    //     () => {
    //         if(isError == true) {
    //             // alert('Koneksi ke server mengalami gangguan');
    //         }                
    //     },
    //     [isError]
    // );

    //refetch token
    useEffect(
        () => {
            if(errorFetchDataPerusahaan != undefined) {
                console.log(errorFetchDataPerusahaan);
                // if(errorFetchDataPerusahaan.data.message == 'Expired JWT') {

                // }
            }
        },
        [errorFetchDataPerusahaan]
    );

    //deteksi data perusahaan sudah tersedia
    useEffect(
        () => {
            if(isFetchingDaftarPerusahaan == false && daftarPerusahaan.length > 0){
                setDataPerusahaan([
                    ...daftarPerusahaan.map(
                        (t) => (
                            {key: t.id, ...omit(t, ['id'])}
                        )
                    )
                ]);
            }
        },
        [daftarPerusahaan, isFetchingDaftarPerusahaan]
    );

    const _onItemInvoked = useCallback(
        (item: IListItemPerusahaan): void => {
            // alert(`Item invoked: ${item.nama}`);
        },
        []
    );

    const handleRenderItemColumn = useCallback(
        (item: IListItemPerusahaan, index: number|undefined, column: IColumn|undefined) => {
            // const fieldContent = item[column!.fieldName as keyof IListItemPerusahaan] as string;
            switch (column!.key) {
                case 'c1':
                    return (
                        <div
                          data-selection-disabled={true}
                          className={mergeStyles({ 
                            backgroundColor: 'yellow', 
                            borderRadius: 3,
                            padding: 4,
                            boxShadow: DefaultEffects.elevation4
                          })}
                        >
                          {item.key}
                        </div>
                    );
                case 'c2':
                    return (
                        <span>{`${item.pelakuUsaha?.singkatan}. ${item.nama}`}</span>
                    );
                case 'c3':
                    let kontak = item[column!.fieldName as keyof IListItemPerusahaan] as IKontak;
                    return (
                        <div>
                            <p
                              className={mergeStyles({ 
                                margin: 0
                              })}
                            >
                                {`Email: ${kontak.email}`}<br />
                                <span style={{display: 'flex'}}>
                                    <label className={mergeStyles({ 
                                            padding: '4px 0px',
                                            display: 'block'
                                          })}
                                    >
                                        Telp: 
                                    </label>
                                    <label className={mergeStyles({ 
                                        borderRadius: 3,
                                        marginLeft: 4,
                                        padding: 4,
                                        backgroundColor: 'green',
                                        boxShadow: DefaultEffects.elevation4,
                                        display: 'block',
                                        color: 'white'
                                        })}
                                    >{`${kontak.telepone}`}</label>
                                </span>
                                {`Fax: ${kontak.fax}`}
                            </p>
                        </div>
                    );
                default:
                    return(<span>{`${item.alamat?.keterangan}`}</span>);
            }
        },
        []
    );
    
    return(     
        <>
        <Stack horizontal tokens={containerLoginStackTokens} style={{borderBottom : '1px solid rgb(237, 235, 233)'}}>
                <Stack.Item>
                    <CommandBar
                        items={_items}   
                    />
                </Stack.Item>
        </Stack>
        <Stack>
            <DetailsList
                items={dataPerusahaan}
                columns={_columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
                selection={_selection}
                selectionPreservedOnEmptyClick={true}
                ariaLabelForSelectionColumn="Toggle selection"
                ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                checkButtonAriaLabel="select row"
                onItemInvoked={_onItemInvoked}
                onRenderDetailsHeader={onRenderDetailsHeader}
                onRenderItemColumn={handleRenderItemColumn}
            />    
        </Stack>
        </> 
    );
    
}