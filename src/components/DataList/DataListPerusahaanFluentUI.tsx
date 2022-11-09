import { DefaultEffects, DetailsList, DetailsListLayoutMode, IColumn, IDetailsHeaderProps, IRenderFunction, mergeStyles, Selection } from "@fluentui/react";
import { FC, ReactNode, useCallback, useEffect, useState } from "react";
import { IKontak } from "../../features/person/person-slice";
import { useGetAllPerusahaanQuery } from "../../features/perusahaan/perusahaan-api-slice";

const _columns = [
    { key: 'c1', name: 'Npwp', fieldName: 'npwp', minWidth: 130, maxWidth: 130, isResizable: true },
    { key: 'c2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Kontak', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Alamat', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
];

export interface IListItemPerusahaan {
    key: string|undefined;
    npwp: string|undefined;
    nama: string|undefined;
    kontak: IKontak|undefined;
    alamat: string|undefined;
};

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
}

export const DataListPerusahaanFluentUI: FC = (props) => {
    const [selectionDetails, setSelectionDetails] = useState<string>('');
    const [dataPerusahaan, setDataPerusahaan] = useState<IListItemPerusahaan[]>([]);

    const _selection = new Selection({
        onSelectionChanged: () => {
            setSelectionDetails(getSelection());
        }
    });

    const getSelection = ():string => {
        const selectionCount = _selection.getSelectedCount();

        switch (selectionCount) {
        case 0:
            return 'No items selected';
        case 1:
            return '1 item selected: ' + (_selection.getSelection()[0] as IListItemPerusahaan).nama;
        default:
            return `${selectionCount} items selected`;
        }
    };

    //rtk query perusahaan variable hook
    const { data: daftarPerusahaan = [], isFetching: isFetchingDaftarPerusahaan, isError } = useGetAllPerusahaanQuery();

    //deteksi error koneksi dengan backend
    useEffect(
        () => {
            if(isError == true) {
                // alert('Koneksi ke server mengalami gangguan');
            }                
        },
        [isError]
    );

    //deteksi data perusahaan sudah tersedia
    useEffect(
        () => {
            if(isFetchingDaftarPerusahaan == false && daftarPerusahaan.length > 0){
                setDataPerusahaan([
                    ...daftarPerusahaan.map(
                        (t) => (
                            {
                                key: t.id, 
                                npwp: t.id, 
                                nama: `${t.pelakuUsaha?.singkatan}. ${t.nama}`,
                                kontak:t.kontak,
                                alamat: `${t.alamat?.keterangan} ${t.alamat!.desa!.nama}, ${t.alamat!.kecamatan!.nama}, ${t.alamat!.kabupaten!.nama}, ${t.alamat!.propinsi!.nama}`
                            }
                        )
                    )
                ]);
            }            
        },
        [daftarPerusahaan, isFetchingDaftarPerusahaan]
    );

    const _onItemInvoked = useCallback(
        (item: IListItemPerusahaan): void => {
            alert(`Item invoked: ${item.nama}`);
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
                          {item[column!.fieldName as keyof IListItemPerusahaan]}
                        </div>
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
                                {`Email: ${kontak!.email}`}<br />
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
                    return(<span>{item[column!.fieldName as keyof IListItemPerusahaan]}</span>);
            }
        },
        []
    );
    
    return(     
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
    );
    
}