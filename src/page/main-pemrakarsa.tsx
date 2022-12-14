import { INavLinkGroup } from "@fluentui/react";
import { FC, useEffect, useState } from "react";
import { KontenDashboardPemrakarsa } from "./pemrakarsa/template-dashboard-pemrakarsa";
import { LeftMenuFluentUI } from "../components/Menu/LeftMenuFluentUI";
import { KontenPelaporanPemrakarsa } from "./pemrakarsa/template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./pemrakarsa/template-permohonan-pemrakarsa";
import { TopBarLayoutFluentUI } from "../components/Layout/TopBarLayoutFluentUI";
import { SideBarLayoutFluentUI } from "../components/Layout/SideBarLayoutFluentUI";
import { AppLayoutFluentUI } from "../components/Layout/AppLayoutFluentUI";
import { MainLayoutFluentUI } from "../components/Layout/MainLayoutFluentUI";
import { PageLayoutFluentUI } from "../components/Layout/PageLayoutFluentUI";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";

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

export const PemrakarsaPage = () => {
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
      console.log('aku');
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
