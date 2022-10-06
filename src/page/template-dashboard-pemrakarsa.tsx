import { Breadcrumb, DefaultEffects, IBreadcrumbItem, IStackStyles, Stack } from "@fluentui/react";
import React, { FC, useCallback, useState } from "react";
import { KontenDashboardDefault } from "./dashboard/template-konten-dashboard-default";
import { KontenDashboardPerusahaan } from "./dashboard/template-konten-dashboard-perusahaan";

const kontenStyles: IStackStyles = {
    root: {
        padding: '0px 16px',        
    },
};
const containerDivStyles: React.CSSProperties = {    
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 16,
    background: 'white',
    height: 'calc(100vh - 148px)',
    marginLeft: 4,
};
const getKontentDashboard = (item: string, ft: any) => {
    let konten = null;
    switch (item) {
        case 'dashboard-default':
            konten = <KontenDashboardDefault setKontenSelected={ft}/>;
            break; 
        case 'Perusahaan':
            konten = <KontenDashboardPerusahaan />;   
            break;
        case 'plp':
            // konten = <KontenPelaporanPemrakarsa />;   
            break;
        default:
            konten = <KontenDashboardDefault />;
            break;
    }
    return konten;
};

export const KontenDashboardPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Dashboard', key: 'dsh', href:''
        }
    ]);
    const [kontenSelected, setKontenSelected] = useState<string>('dashboard-default');    

    const handleChangeKontenPage = useCallback(
        (item) => {
            switch (item) {
                case 'dashboard-default':
                    setItemBreadcrumb([{text: 'Dashboard', key: 'dsh', href:''}]);
                    setKontenSelected(item);
                    break;
                case 'Perusahaan':
                    setItemBreadcrumb([{text: 'Dashboard', key: 'dsh', href:''}]);
                    setKontenSelected(item);
                    break;
                default:
                    setItemBreadcrumb([{text: 'Dashboard', key: 'dsh', href:''}]);
                    setKontenSelected(item);
                    break;
            }
        },
        []
    );

    return(
        <Stack styles={kontenStyles}>
            <Stack.Item align="auto">                
                <Breadcrumb
                    items={itemBreadcrumb}
                    maxDisplayedItems={3}
                    ariaLabel="Breadcrumb beranda"
                    overflowAriaLabel="More links"
                />
            </Stack.Item>
            <Stack.Item grow align="auto">   
                <div style={containerDivStyles}>
                    {
                        getKontentDashboard(kontenSelected, handleChangeKontenPage)
                    }
                </div>   
            </Stack.Item>
        </Stack>
    );
};
