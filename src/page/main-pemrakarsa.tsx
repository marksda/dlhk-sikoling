import { INavLinkGroup } from "@fluentui/react";
import { FC, useState } from "react";
import { KontenDashboardPemrakarsa } from "./pemrakarsa/template-dashboard-pemrakarsa";
import { LeftMenuFluentUI } from "../components/Menu/LeftMenuFluentUI";
import { KontenPelaporanPemrakarsa } from "./template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./template-permohonan-pemrakarsa";
import { TopBarLayoutFluentUI } from "../components/Layout/TopBarLayoutFluentUI";
import { SideBarLayoutFluentUI } from "../components/Layout/SideBarLayoutFluentUI";
import { AppLayoutFluentUI } from "../components/Layout/AppLayoutFluentUI";
import { MainLayoutFluentUI } from "../components/Layout/MainLayoutFluentUI";
import { PageLayoutFluentUI } from "../components/Layout/PageLayoutFluentUI";

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

const getContentPage = (idContentPage: string) => {
    let konten = null;
    switch (idContentPage) {
        case 'dsb':
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
};

export const PemrakarsaPage: FC = () => {
    const [idContentPage, setIdContentPage] = useState<string>('dsb');

    return (        
        <AppLayoutFluentUI>
            <TopBarLayoutFluentUI />
            <MainLayoutFluentUI>
                <SideBarLayoutFluentUI>
                  <LeftMenuFluentUI 
                    menus={navLinkGroups}
                    setIdContentPage={setIdContentPage}
                  />
                </SideBarLayoutFluentUI>
                <PageLayoutFluentUI>
                    {
                        getContentPage(idContentPage)
                    }
                </PageLayoutFluentUI>
            </MainLayoutFluentUI>
        </AppLayoutFluentUI>
    );
};

