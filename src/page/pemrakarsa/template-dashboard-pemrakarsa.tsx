import { Breadcrumb, IBreadcrumbItem, IStackStyles, Stack } from "@fluentui/react";
import React, { FC, useCallback, useState } from "react";
import { KontenDashboardDefault } from "./dashboard/template-konten-dashboard-default";
import { KontenDashboardPerusahaan } from "./dashboard/template-konten-dashboard-perusahaan";

const kontenStyles: IStackStyles = {
    root: {
        padding: '0px 16px',       
    },
};
const getKontentDashboard = (item: string, ft: (item: string) => void) => {
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
    //this is used to handling event breadcrumb onClick
    const _onBreadcrumbItemClicked = useCallback(
        (ev?: React.MouseEvent<HTMLElement>, item?: IBreadcrumbItem) => {
            console.log(item);
            setItemBreadcrumb([{text: 'Dashboard', key: item!.key, onClick: _onBreadcrumbItemClicked}]);
            setKontenSelected(item!.key);
        },
        []
    );
    //local state    
    const [kontenSelected, setKontenSelected] = useState<string>('dashboard-default');    
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {text: 'Dashboard', key: 'dashboard-default', onClick: _onBreadcrumbItemClicked}
    ]);

    const handleChangeKontenPage = useCallback(
        (item) => {
            switch (item) {
                case 'dashboard-default':
                    setItemBreadcrumb([{text: 'Dashboard', key: 'dashboard-default', onClick: _onBreadcrumbItemClicked}]);
                    setKontenSelected(item);
                    break;
                case 'Perusahaan':
                    setItemBreadcrumb([
                        {text: 'Dashboard', key: 'dashboard-default', onClick: _onBreadcrumbItemClicked},
                        {text: 'Perusahaan', key: 'Perusahaan', href:''}
                    ]);
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
                {
                    getKontentDashboard(kontenSelected, handleChangeKontenPage)
                } 
            </Stack.Item>
        </Stack>
    );
};
