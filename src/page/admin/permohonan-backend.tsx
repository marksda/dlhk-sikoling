import { ILabelStyles, IStyleSet, Label, Pivot, PivotItem, mergeStyleSets } from "@fluentui/react";
import { FC } from "react";
import { DataListPermohonanFluentUI } from "../../components/DataList/backend/DataListPermohonanFluentUI";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};

const classNames = mergeStyleSets({
    container: {
        width: "100%",
        height: '100%',
        position: "relative",
        minHeight: 200,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        // flexGrow: 1
        // flex: '1 1 auto'
    }
});

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
                style={{padding: 4, height: window.innerHeight - 115}}
            >
                <DataListPermohonanFluentUI
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
