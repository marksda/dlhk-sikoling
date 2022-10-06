import { DetailsList, DetailsListLayoutMode, Stack } from "@fluentui/react";
import { FC } from "react";

export const KontenDashboardPerusahaan: FC = (props) => {
    //rtk query jenisKelamin variable hook
    const { data: daftarPerusahaan = [], isFetching: isFetchingDaftarPerusahaan } = useGetAllJenisKelaminQuery();  
    const _daftarPerusahaan = daftarPerusahaan.map(
        (t) => { return {key: t.id as string, text: t.nama as string}; }
    );

    return(
        <Stack>
            <Stack.Item>
                <DetailsList
                    items={items}
                    columns={this._columns}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    selection={this._selection}
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