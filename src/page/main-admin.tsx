import { getTheme, INavLinkGroup, IStackItemStyles, IStackStyles } from "@fluentui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { AppLayoutFluentUI } from "../components/Layout/AppLayoutFluentUI";
import { MainLayoutFluentUI } from "../components/Layout/MainLayoutFluentUI";
import { PageLayoutFluentUI } from "../components/Layout/PageLayoutFluentUI";
import { SideBarLayoutFluentUI } from "../components/Layout/SideBarLayoutFluentUI";
import { TopBarLayoutFluentUI } from "../components/Layout/TopBarLayoutFluentUI";
import { LeftMenuFluentUI } from "../components/Menu/LeftMenuFluentUI";
import { PermohonanBackEnd } from "./admin/permohonan-backend";
import { KontenDashboardPemrakarsa } from "./pemrakarsa/template-dashboard-pemrakarsa";
import { KontenPelaporanPemrakarsa } from "./pemrakarsa/template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./pemrakarsa/template-permohonan-pemrakarsa";

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

export const AdminPage: FC = () => {
    //react redux hook variable
    const token = useAppSelector((state) => state.token); 
    //react local state
    const [idContentPage, setIdContentPage] = useState<string>(navLinkGroups[0].links[0].key!);  
    //react router hook variable
    const navigate = useNavigate();

    useEffect(
        () => {            
            if(token.hakAkses == null) {
            navigate("/");          
            }
        },
        [token]
    );

    return (        
        <>
        {
            token.hakAkses != null ? ( 
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
                        <AnimatePresence>
                        <motion.div
                            key={idContentPage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {
                            getContentPage(idContentPage)
                            }
                        </motion.div>
                        </AnimatePresence>
                    </PageLayoutFluentUI>
                </MainLayoutFluentUI>
            </AppLayoutFluentUI>
            ) : null
        }
        </>
    );
};

const getContentPage = (idContentPage: string) => {
    let konten = null;
    switch (idContentPage) {
        case 'dsb':
            konten =             
              <KontenDashboardPemrakarsa />;
            break; 
        case 'pmh':
            konten = <PermohonanBackEnd />;   
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
