import { DetailsList, DetailsListLayoutMode, Stack } from "@fluentui/react";
import { FC } from "react";
import { useGetAllPerusahaanQuery } from "../../features/perusahaan/perusahaan-api-slice";

const columns = [
    { key: 'column1', name: 'Npwp', fieldName: 'npwp', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column2', name: 'Nama', fieldName: 'nama', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column3', name: 'Akta', fieldName: 'akta', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'column4', name: 'Oss', fieldName: 'Oss', minWidth: 100, maxWidth: 200, isResizable: true },
];

export const KontenDashboardPerusahaan: FC = (props) => {
    
    //rtk query perusahaan variable hook
    const { data: daftarPerusahaan = [], isFetching: isFetchingDaftarPerusahaan } = useGetAllPerusahaanQuery(); 
    const _daftarPerusahaan = daftarPerusahaan.map(
        (t) => { return {key: t.id as string, text: t.nama as string}; }
    );

    // _selection = new Selection({
    //     onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    // });

    return(
        <Stack>
            <Stack.Item>
                <DetailsList
                    items={_daftarPerusahaan}
                    columns={columns}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={_selection}
                    selectionPreservedOnEmptyClick={true}
                    ariaLabelForSelectionColumn="Toggle selection"
                    ariaLabelForSelectAllCheckbox="Toggle selection for all items"
                    checkButtonAriaLabel="select row"
                    onItemInvoked={this._onItemInvoked}
                />
            </Stack.Item>
        </Stack>
    );
    
}