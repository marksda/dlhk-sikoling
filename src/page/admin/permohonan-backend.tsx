import { Tab, TabList, Tabs } from "@chakra-ui/react";
import { FC } from "react";

export const PermohonanBackEnd: FC = () => {

    return (
        <Tabs>
            <TabList>
                <Tab>FO-Helpdesk</Tab>
                <Tab>BO-Teknis</Tab>
                <Tab>FO-Korektor</Tab>
                <Tab>BO-Kasubid</Tab>
                <Tab>BO-Kabid</Tab>
                <Tab>BO-Ka. DLHK</Tab>
                <Tab>BO-Ka. DLHK</Tab>
                <Tab>BO-Penomoran (TU)</Tab>
                <Tab>BO-Penyerahan (TU)</Tab>
            </TabList>
        </Tabs>
    )
}