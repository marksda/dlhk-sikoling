import { CommandBar, DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IDetailsHeaderProps, IObjectWithKey, IRenderFunction, IStackTokens, mergeStyles, Selection, SelectionMode, Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { IListItemRegisterPerusahaan, ISubFormDetailPerusahaanProps } from "./InterfaceDataListPerusahaan";

const _columns = [
    { key: 'c1', name: 'Npwp', fieldName: 'npwp', minWidth: 130, maxWidth: 130, isResizable: true },
    { key: 'c2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Kontak', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Alamat', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
];
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPerusahaanFluentUI: FC<ISubFormDetailPerusahaanProps> = ({showModalAddPerusahaan, hideModalAddModalPerusahaan, dataPerusahaan, deletePerusahaan}) => {
    // console.log(dataPerusahaan);
    // local state
    const [selectedItems, setSelectedItems] = useState<IObjectWithKey[]>([]);

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

    // useEffect(
    //     () => {
    //         if(isFetchingDaftarRegisterPerusahaan == false && daftarRegisterPerusahaan.length > 0){
    //             setDataPerusahaan([
    //                 ...daftarRegisterPerusahaan.map(
    //                     (t) => (
    //                         {key: t.perusahaan?.id as string, ...omit(t, ['id'])}
    //                     )
    //                 )
    //             ]);
    //         }
    //     },
    //     [daftarRegisterPerusahaan, isFetchingDaftarRegisterPerusahaan]
    // );

    const _onItemInvoked = useCallback(
        (item: IListItemRegisterPerusahaan): void => {
            // alert(`Item invoked: ${item.nama}`);
        },
        []
    );

    const handleRenderItemColumn = useCallback(
        (item: IListItemRegisterPerusahaan, index: number|undefined, column: IColumn|undefined) => {
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
                        <span>{`${item.perusahaan?.pelakuUsaha?.singkatan}. ${item.perusahaan?.pelakuUsaha?.nama}`}</span>
                    );
                case 'c3':
                    let kontak = item.perusahaan?.kontak;
                    return (
                        <div>
                            <p
                              className={mergeStyles({ 
                                margin: 0
                              })}
                            >
                                {`Email: ${kontak?.email}`}<br />
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
                                    >{`${kontak!.telepone}`}</label>
                                </span>
                                {`Fax: ${kontak!.fax}`}
                            </p>
                        </div>
                    );
                default:
                    return(<span>{`${item.perusahaan?.alamat?.keterangan}`}</span>);
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
                // onRenderDetailsHeader={onRenderDetailsHeader}
                onRenderItemColumn={handleRenderItemColumn}
            />    
        </Stack>
        </> 
    );
    
}