import { Card, CardBody, CardHeader, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { ILabelStyles, IStyleSet, Label, Pivot, PivotItem } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { DataListPermohonanFluentUI } from "../../components/DataList/permohonan/DataListPermohonanFluentUi";
import { IListItemRegisterPermohonan } from "../../components/DataList/permohonan/InterfaceDataListPermohonan";
import { useGetRegisterPermohonanByPengirimAtauPenerimaOnProsesQuery } from "../../features/permohonan/register-permohonan-api-slice";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};

export const PermohonanBackEnd: FC = () => {
    const token = useAppSelector((state) => state.token);
    console.log(token);
     //rtk query permohonan variable hook
     const {data: daftarRegisterPermohonan, error, isFetching, isError} = useGetRegisterPermohonanByPengirimAtauPenerimaOnProsesQuery({
        idPengirim: '1',
        idPenerima: '1'
     });
     
     const dataRegisterPermohonan: IListItemRegisterPermohonan[] = useMemo(
        () => {
            if(daftarRegisterPermohonan != undefined) {
                return [
                    ...daftarRegisterPermohonan.map(
                        (t) => (
                            {key: t.id as string, ...omit(t, ['id'])}
                        )
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarRegisterPermohonan]
    );

    return (
        <Pivot>
            <PivotItem
                headerText="Permohonan Masuk"
                headerButtonProps={{
                'data-order': 1,
                'data-title': 'baru',
                }}
                itemIcon="DownloadDocument"
            >
                <DataListPermohonanFluentUI dataPermohonan={dataRegisterPermohonan}/>
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
}