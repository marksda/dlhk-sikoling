import { CommandBar, DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IObjectWithKey, IStackTokens, mergeStyles, Selection, SelectionMode, Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";

const _columns = [
    { key: 'c1', name: 'Kode', fieldName: 'npwp', minWidth: 130, maxWidth: 130, isResizable: true },
    { key: 'c2', name: 'Keterangan', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true }
];
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};

export const DataListPerusahaanFluentUI = () => {
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
                onClick: showModalAddPerusahaan,
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
                          {item.perusahaan?.id}
                        </div>
                    );
                case 'c2':
                    return (
                        <span>{
                            item.perusahaan?.pelakuUsaha !== undefined ?
                            `${item.perusahaan?.pelakuUsaha?.singkatan}. ${item.perusahaan?.nama}` :
                            `${item.perusahaan?.nama}`
                        }</span>
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
                case 'c4':
                    return (
                        <span>{`${item.perusahaan?.alamat?.keterangan}`}</span>
                    );
                case 'c5':
                    return(
                        <>
                        <span>Jumlah Dokumen : {item.perusahaan?.daftarRegisterDokumen?.length}</span><br />                     
                        {
                            item.perusahaan?.daftarRegisterDokumen!.map((dataRegisterDokumen:IRegisterDokumen) => {
                                let dokumen = null;
                                if(dataRegisterDokumen.dokumen?.id == '010401') {
                                    dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                    dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                    dokumen = dataRegisterDokumen.dokumen as IAktaPendirian;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>notaris: {dokumen?.namaNotaris}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.noSurat}</span><br />
                                            <span>perihal: {dokumen?.perihalSurat}</span><br />
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenOss;
                                    return (
                                        <>
                                            <span>- {dokumen?.nama}</span><br />
                                            <span>Nomor: {dokumen?.nomor}</span><br />
                                            <span>perihal: {dokumen?.tanggal}</span><br />
                                        </>                                    
                                    );
                                }
                            })
                        }
                        </>
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
                onRenderItemColumn={handleRenderItemColumn}
            />    
        </Stack>
        </> 
    );    
    
}