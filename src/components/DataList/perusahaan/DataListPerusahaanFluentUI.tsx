import { CommandBar, DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, ICommandBarItemProps, IObjectWithKey, IStackTokens, Link, mergeStyles, mergeStyleSets, Selection, SelectionMode, Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { baseRestAPIUrl } from "../../../features/config/config";
import { IAktaPendirian } from "../../../features/dokumen/akta-pendirian-slice";
import { IDokumenNibOss } from "../../../features/dokumen/dokumen-nib-oss-slice";
import { ILampiranSuratArahan } from "../../../features/dokumen/lampiran-surat-arahan-api-slice";
import { IRegisterDokumen } from "../../../features/dokumen/register-dokumen-slice";
import { IRekomendasiDPLH } from "../../../features/dokumen/rekomendasi-dplh-api-slice";
import { IRekomendasiUKLUPL } from "../../../features/dokumen/rekomendasi-ukl-upl-api-slice";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan-api-slice";
import { IListItemRegisterPerusahaan, ISubFormDetailPerusahaanProps } from "./InterfaceDataListPerusahaan";

const _columns = [
    { key: 'c1', name: 'Npwp', fieldName: 'npwp', minWidth: 130, maxWidth: 130, isResizable: true },
    { key: 'c2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Kontak', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Alamat', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c5', name: 'Dokumen', fieldName: 'dokumen', minWidth: 100, maxWidth: 200, isResizable: true },
];
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};
const contentStyles = mergeStyleSets({
    contenItemDok: {
        marginLeft: 12,
        marginBottom: 4,
    },
    title: {
        fontWeight: 'bold',
    },
    mainTitle: {
        marginBottom: 4,
        fontWeight: 'bold',
    }
});

const _getKey = (item: any, index?: number): string => {
    return item.key;
};

export const DataListPerusahaanFluentUI: FC<ISubFormDetailPerusahaanProps> = ({showModalAddPerusahaan, isDataLoading, dataPerusahaan, deletePerusahaan}) => {
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
                        <div className={contentStyles.mainTitle}>Jumlah Dokumen : {item.perusahaan?.daftarRegisterDokumen?.length}</div>                    
                        {
                            item.perusahaan?.daftarRegisterDokumen!.map((dataRegisterDokumen:IRegisterDokumen, index) => {
                                let dokumen = null;
                                if(dataRegisterDokumen.dokumen?.id == '010401') {
                                    dokumen = dataRegisterDokumen.dokumen as ISuratArahan;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span >Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010402') {
                                    dokumen = dataRegisterDokumen.dokumen as ILampiranSuratArahan;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span>Nomor surat arahan: {dokumen?.noSuratArahan}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                            
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010101') {
                                    dokumen = dataRegisterDokumen.dokumen as IAktaPendirian;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span>Nomor: {dokumen?.nomor}</span><br />
                                                <span>notaris: {dokumen?.namaNotaris}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010404') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiUKLUPL;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span>Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010406') {
                                    dokumen = dataRegisterDokumen.dokumen as IRekomendasiDPLH;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span>Nomor: {dokumen?.noSurat}</span><br />
                                                <span>perihal: {dokumen?.perihalSurat}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
                                        </>                                    
                                    );
                                }
                                else if(dataRegisterDokumen.dokumen?.id == '010301') {
                                    dokumen = dataRegisterDokumen.dokumen as IDokumenNibOss;
                                    return (
                                        <>
                                            <div className={contentStyles.title}>{index+1}. {dokumen?.nama}</div>
                                            <div className={contentStyles.contenItemDok}>
                                                <span>Nomor: {dokumen?.nomor}</span><br />
                                                <span>perihal: {dokumen?.tanggal}</span><br />
                                                <Link 
                                                    href={`${baseRestAPIUrl}files/nosecure/dok/${item.perusahaan?.id}/${dataRegisterDokumen.lokasiFile}`}
                                                    target="_blank"
                                                    underline
                                                >
                                                    Download dokumen
                                                </Link>
                                            </div>
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
                setKey="none"
                getKey={_getKey}
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