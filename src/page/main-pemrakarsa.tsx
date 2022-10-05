import { getTheme, INavLink, INavLinkGroup, INavStyles, IStackItemStyles, IStackStyles, Stack } from "@fluentui/react";
import { FC, useCallback, useState } from "react";
import { KontenDashboardPemrakarsa } from "./dashboard/template-dashboard-pemrakarsa";
import { LeftMenuFluentUI } from "../components/menu/LeftMenuFluentUI";
import { KontenPelaporanPemrakarsa } from "./template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./template-permohonan-pemrakarsa";

const theme = getTheme();
const stackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        lineHeight: '50px',
        padding: '0 20px',
    },
};
const stackMainContainerStyles: IStackStyles = {
    root: {
        backgroundColor: '#F6F8F9'
    },
};
const labelStyles: IStackItemStyles = {
    root: {
      fontSize: '1.2em',
      fontWeight: 500
    },
};
const leftPanelStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 68px)',
        width: 200,
        padding: 8,        
        border: '1px solid #eee',
    },
};
const rightPanelStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 60px)',
        // padding: '0px 4px 8px 4px',   
        padding: 0,     
    },
};
const navStyles: Partial<INavStyles> = {
    root: {
      height: 'calc(100vh - 68px)',
      boxSizing: 'border-box',
      overflowY: 'auto',
    },
};
const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Dashboard',
          url: '',
          icon: 'Home',
          key: 'dsb',
          isExpanded: true,
          target: '_self',
        },
        {
          name: 'Permohonan',
          url: '',
        //   url: 'http://localhost:3000/pemrakarsa/permohonan',
          icon: 'ChangeEntitlements',
          key: 'pmh',
          isExpanded: true,
          target: '_self',
        },
        {
          name: 'Pelaporan',
          url: '',
          icon: 'ReportDocument',
          key: 'plp',
          target: '_blank',
        },
        {
          name: 'Pengawasan - SKPL',
          url: '',
          icon: 'ComplianceAudit',
          key: 'key7',
          target: '_blank',
        },
        {
          name: 'Bantuan',
          url: '',
          icon: 'Dictionary',
          key: 'bnt',
          target: '_blank',
        },
      ],
    },
];
const getKontent = (item: string) => {
    let konten = null;
    switch (item) {
        case 'brd':
            konten = <KontenDashboardPemrakarsa />;
            break; 
        case 'pmh':
            konten = <KontenPermohonanPemrakarsa />;   
            break;
        case 'plp':
            konten = <KontenPelaporanPemrakarsa />;   
            break;
        default:
            konten = <KontenDashboardPemrakarsa />;
            break;
    }
    return konten;
} 

export const PemrakarsaPage: FC = () => {
    const [selectedKeyItemMenu, setSelectedKeyItemMenu] = useState<string>('dsb');

    const onItemMenuSelected = useCallback(
        (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
            if(item) {
                setSelectedKeyItemMenu(item.key!);
            }
        },
        []
    );

    return (        
        <Stack>
            <Stack horizontal styles={stackStyles}>
                <Stack.Item grow align="center" styles={labelStyles}>
                    Sikoling  
                </Stack.Item>  
            </Stack>
            <Stack horizontal styles={stackMainContainerStyles}>
                <Stack.Item styles={leftPanelStyles}>
                    <LeftMenuFluentUI 
                        onLinkClick={onItemMenuSelected}
                        selectedKey={selectedKeyItemMenu}
                        ariaLabel="left menu sikoling"
                        styles={navStyles}
                        groups={navLinkGroups}
                    />
                </Stack.Item>  
                <Stack.Item grow styles={rightPanelStyles}>
                    {
                        getKontent(selectedKeyItemMenu)
                    }
                </Stack.Item>
            </Stack>
        </Stack>
    );
}
