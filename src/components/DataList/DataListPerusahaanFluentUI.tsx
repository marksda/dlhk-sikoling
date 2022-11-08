import { DetailsList, DetailsListLayoutMode, IDetailsHeaderProps, IRenderFunction, Selection } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { useGetAllPerusahaanQuery } from "../../features/perusahaan/perusahaan-api-slice";

const _columns = [
    { key: 'c1', name: 'Npwp', fieldName: 'npwp', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c3', name: 'Kontak', fieldName: 'kontak', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'c4', name: 'Alamat', fieldName: 'alamat', minWidth: 100, maxWidth: 200, isResizable: true },
];

export interface IDetailsListBasicExampleItem {
    key: string;
    npwp: string;
    nama: string;
    kontak: string;
    alamat: string;
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
    const [dataPerusahaan, setDataPerusahaan] = useState<any[]>([]);

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
            return '1 item selected: ' + (_selection.getSelection()[0] as IDetailsListBasicExampleItem).nama;
        default:
            return `${selectionCount} items selected`;
        }
    };

    //rtk query perusahaan variable hook
    const { data: daftarPerusahaan = [], isFetching: isFetchingDaftarPerusahaan } = useGetAllPerusahaanQuery(); 

    //deteksi data perusahaan sudah tersedia
    useEffect(
        () => {
            // if(isFetchingDaftarPerusahaan == false){
                setDataPerusahaan([
                    ...daftarPerusahaan.map(
                        (t) => (
                            {
                                key: t.id, 
                                npwp: t.id, 
                                nama: `${t.pelakuUsaha?.singkatan}. ${t.nama}`,
                                kontak:`Email: ${t.kontak?.email}, Telp: ${t.kontak?.telepone}, Fax: ${t.kontak?.fax}`,
                                alamat: `${t.alamat?.keterangan} ${t.alamat!.desa!.nama}, ${t.alamat!.kecamatan!.nama}, ${t.alamat!.kabupaten!.nama}, ${t.alamat!.propinsi!.nama}`
                            }
                        )
                    )
                ]);
            // }            
        },
        [daftarPerusahaan]
    );

    const _onItemInvoked = useCallback(
        (item: IDetailsListBasicExampleItem): void => {
            alert(`Item invoked: ${item.nama}`);
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
        />     
    );
    
}