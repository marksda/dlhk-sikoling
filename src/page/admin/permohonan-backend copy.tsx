import { Card, CardBody, CardHeader, Heading, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import omit from "lodash.omit";
import { FC, useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import { DataListPermohonanFluentUI } from "../../components/DataList/permohonan/DataListPermohonanFluentUi";
import { IListItemRegisterPermohonan } from "../../components/DataList/permohonan/InterfaceDataListPermohonan";
import { useGetRegisterPermohonanByPengirimAtauPenerimaOnProsesQuery } from "../../features/permohonan/register-permohonan-api-slice";

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
        <Tabs isLazy>
            {
                token.hakAkses == 'Administrator' ?
                <TabList>                
                    <Tab>FO-Helpdesk</Tab>
                    <Tab>BO-Teknis</Tab>
                    <Tab>FO-Korektor</Tab>
                    <Tab>BO-Kasubid</Tab>
                    <Tab>BO-Kabid</Tab>
                    <Tab>BO-Ka. DLHK</Tab>
                    <Tab>BO-Penomoran (TU)</Tab>
                    <Tab>BO-Penyerahan (TU)</Tab>
                </TabList> : null
            }            
            <TabPanels>
                <TabPanel pl="0px" pr="0px" pb="0px">
                    <Card h={'calc(100vh - 140px)'}>
                        <CardHeader pb="0px">
                            <Heading size='md'>Data Permohonan</Heading>
                        </CardHeader>
                        <CardBody pt="0px">
                            <DataListPermohonanFluentUI dataPermohonan={dataRegisterPermohonan}/>
                        </CardBody>
                    </Card>                    
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}