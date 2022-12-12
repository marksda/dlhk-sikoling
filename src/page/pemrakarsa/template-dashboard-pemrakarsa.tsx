import { Breadcrumb,  Stack } from "@fluentui/react";
import React, { FC, useMemo, useState } from "react";
import { DashboardDefault } from "./dashboard/default";
import { KontenDashboardPerusahaan } from "./dashboard/dashboard-perusahaan";



export const KontenDashboardPemrakarsa: FC = () => {
    //local state    
    const [selectedPage, getSelectedPage] = useState<string>('default');

    const konten = useMemo(
        () => {
            return getKontentDashboard(selectedPage, getSelectedPage);
        },
        [selectedPage]
    );

    return(
        <div style={{margin: '0px 16px'}}>{konten}</div>
        );
};

const getKontentDashboard = (item: string, setParentPage: React.Dispatch<React.SetStateAction<string>>) => {
    let konten = null;
    switch (item) {
        case 'default':
            konten = 
                <Stack>
                    <Stack.Item>                
                        <Breadcrumb
                            items={[{text: 'Dashboard', key: 'dashboard-default'}]}
                            maxDisplayedItems={3}
                            ariaLabel="Breadcrumb beranda"
                            overflowAriaLabel="More links"
                        />
                    </Stack.Item>
                    <Stack.Item grow align="auto"> 
                        <DashboardDefault setParentPage={setParentPage}/>
                    </Stack.Item>
                </Stack>;
            break; 
        case 'Perusahaan':
            konten = 
                <Stack>
                    <Stack.Item>                
                        <Breadcrumb
                            items={[
                                {text: 'Dashboard', key: 'default', onClick: () => setParentPage('default')},
                                {text: 'Perusahaan', key: 'Perusahaan', href:''}
                            ]}
                            maxDisplayedItems={3}
                            ariaLabel="Breadcrumb beranda"
                            overflowAriaLabel="More links"
                        />
                    </Stack.Item>
                    <Stack.Item grow align="auto"> 
                        <KontenDashboardPerusahaan/>
                    </Stack.Item>
                </Stack>;
            break;
        case 'plp':
            // konten = <KontenPelaporanPemrakarsa />;   
            break;
        default:
            break;
    }
    return konten;
};