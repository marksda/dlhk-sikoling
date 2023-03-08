import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { DefaultEffects, Label, Stack } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useMemo } from "react";
import { DataListFlowLogFluentUI } from "../../components/DataList/log/DataListFlowLogFluentUi";
import { IListItemFlowLog } from "../../components/DataList/log/InterfaceDataListFlowLog";
import { useGetFlowLogByKategoriQuery } from "../../features/log/flow-log-api-slice";

const stackHorTokens = { childrenGap: 16 };
const containerBlueStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    borderTop: '2px solid #0078D7', 
    width: 280,
    borderRadius: 3, 
    padding: '0px 16px 8px 16px',
    background: 'white',
};
const containerDetailBadget: React.CSSProperties = {    
    display: "inline-block", 
    border: '1px solid #b4b1ce63', 
    padding: 8,
    width: '250px',
    background: '#7ce1f996'
};


export const DashboardBackEnd: FC = () => {
    //rtk query perusahaan variable hook
    const { data: daftarFlowLog, error: errorFetchDataFlowLog,  isFetching: isFetchingDataFlowLog, isError } = useGetFlowLogByKategoriQuery('1');
    
    const dataFlowLog: IListItemFlowLog[] = useMemo(
        () => {
            if(daftarFlowLog != undefined) {
                return [
                    ...daftarFlowLog.map(
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
        [daftarFlowLog]
    );

    return (
        <Accordion>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Statistik permohonan, pertek dan pelaporan dokumen lingkungan
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Stack horizontal wrap tokens={stackHorTokens}>
                        <div style={containerBlueStyles}>
                            <Label style={{color: '#009340'}}>Permohonan Arahan</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item style={{cursor: 'pointer'}}>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>  
                        <div style={containerBlueStyles}>
                            <Label style={{color: '#009340'}}>Permohonan UKL-UPL</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>   
                        <div style={containerBlueStyles}>
                            <Label style={{color: '#009340'}}>Permohonan SPPL</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div> 
                        <div style={containerBlueStyles}>
                            <Label style={{color: 'rgb(240, 67, 67)'}}>Pertek Pengolahan Limbah B3</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div> 
                        <div style={containerBlueStyles}>
                            <Label style={{color: 'rgb(240, 67, 67)'}}>Pertek Pemenuhan BMAL</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>
                        <div style={containerBlueStyles}>
                            <Label style={{color: 'rgb(142, 72, 1)'}}>Pelaporan Pembuangan Air Limbah</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>
                        <div style={containerBlueStyles}>
                            <Label style={{color: 'rgb(142, 72, 1)'}}>Pelaporan Penyimpanan Limbah B3</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>
                        <div style={containerBlueStyles}>
                            <Label style={{color: 'rgb(142, 72, 1)'}}>Pelaporan Kualitas Udara</Label>
                            <div style={containerDetailBadget}>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Baru
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Dalam proses
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Ditolak
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                                <Stack horizontal horizontalAlign="space-between">
                                    <Stack.Item>
                                        Selesai
                                    </Stack.Item>
                                    <Stack.Item>
                                        8
                                    </Stack.Item>
                                </Stack>
                            </div>
                        </div>
                    </Stack>     
                </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box as="span" flex='1' textAlign='left'>
                        Monitoring Permohonan dan Laporan
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                    <Tabs variant='enclosed'>
                        <TabList>
                            <Tab>Permohonan</Tab>
                            <Tab>Laporan</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <DataListFlowLogFluentUI
                                    dataFlowLog={dataFlowLog}
                                />
                            </TabPanel>
                            <TabPanel>
                                <p>two!</p>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    )
}