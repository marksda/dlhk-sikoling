import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { DefaultEffects, Label, Stack } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useMemo } from "react";
import { DataListFlowLogFluentUI } from "../../components/DataList/log/DataListFlowLogFluentUi";
import { IListItemFlowLog } from "../../components/DataList/log/InterfaceDataListFlowLog";

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
    // const { data: daftarFlowLog, error: errorFetchDataFlowLog,  isFetching: isFetchingDataFlowLog, isError } = useGetFlowLogByKategoriQuery('1');
    
    // const dataFlowLog: IListItemFlowLog[] = useMemo(
    //     () => {
    //         if(daftarFlowLog != undefined) {
    //             return [
    //                 ...daftarFlowLog.map(
    //                     (t) => (
    //                         {key: t.id as string, ...omit(t, ['id'])}
    //                     )
    //                 )
    //             ];
    //         }
    //         else {
    //             return [];
    //         }
    //     },
    //     [daftarFlowLog]
    // );

    return (
        <DataListFlowLogFluentUI /> 
    )
}