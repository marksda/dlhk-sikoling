import { ILabelStyles, IRenderFunction, ISearchBoxStyles, IStyleSet, Label, mergeStyleSets, Pivot, PivotItem, PrimaryButton, ScrollablePane, SearchBox, SelectionMode, Stack } from "@fluentui/react";
import { FC } from "react";
import { DataListPermohonanFluentUI } from "../../components/DataList/permohonan/DataListPermohonanFluentUi";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};

export const PermohonanBackEnd: FC = () => {
    return (
        <Pivot>
            <PivotItem
                headerText="Permohonan Masuk"
                headerButtonProps={{
                'data-order': 1,
                'data-title': 'baru',
                }}
                itemIcon="DownloadDocument"
                style={{padding: 8}}
            >
                <DataListPermohonanFluentUI
                    minu
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
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
                        }
                    }
                />
            </PivotItem>
            <PivotItem 
                headerText="Permohonan Keluar"
                itemIcon="Generate"
            >
                <Label styles={labelStyles}>Pivot #2</Label>
            </PivotItem>
            <PivotItem 
                headerText="Permohonam Selesai"
                itemIcon="DocumentApproval"    
            >
                <Label styles={labelStyles}>Pivot #3</Label>
            </PivotItem>
            <PivotItem 
                headerText="Permohonan Tertolak"
                itemIcon="PageRemove"
            >
                <Label styles={labelStyles}>Pivot #3</Label>
            </PivotItem>
        </Pivot>
    )
};
