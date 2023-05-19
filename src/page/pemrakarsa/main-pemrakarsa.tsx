import { INavLinkGroup, Stack, mergeStyleSets } from "@fluentui/react";
import { useEffect, useState } from "react";
import { KontenDashboardPemrakarsa } from "./template-dashboard-pemrakarsa";
import { KontenPelaporanPemrakarsa } from "./template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./template-permohonan-pemrakarsa";
import { TopBarLayoutFluentUI } from "../../components/Layout/TopBarLayoutFluentUI";
import { SideBarLayoutFluentUI } from "../../components/Layout/SideBarLayoutFluentUI";
import { MainLayoutFluentUI } from "../../components/Layout/MainLayoutFluentUI";
import { PageLayoutFluentUI } from "../../components/Layout/PageLayoutFluentUI";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { LeftMenuFluentUI } from "../../components/Menu/LeftMenuFluentUI";

const classNames = mergeStyleSets({
  container: {
      width: "100%",
      height: "100%",
      position: "relative",
      minHeight: 200,
  },
  gridContainer: {
    height: '100%',
    overflowY: "auto",
    overflowX: "auto",
    position: "relative",
  },
  leftKonten: {
    height: '100%',
    width: 200,
    padding: 8,        
    border: '1px solid #eee',
    background: '#f9f6f6',
  },
  mainKonten: {
    padding: 4,     
    backgroundColor: 'white'
  }
});

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
      switch (token.hakAkses) {
        case 'Administrator':
          navigate("/admin");
          break;
        case 'Umum':
          break;
        default:
          navigate("/"); 
          break;
      }  
    },
    [token]
  );
  
  return (       
    <>
    {
      token.hakAkses == "Umum" ? ( 
        <Stack grow verticalFill className={classNames.container}>
          <TopBarLayoutFluentUI />
          <Stack.Item grow className={classNames.gridContainer}>
            <Stack horizontal>
              <Stack.Item className={classNames.leftKonten}>
                <LeftMenuFluentUI 
                  menus={navLinkGroups}
                  setIdContentPage={setIdContentPage}
                />
              </Stack.Item>
              <Stack.Item grow className={classNames.mainKonten}>
                {getContentPage(idContentPage)}
              </Stack.Item>
            </Stack>
          </Stack.Item>
      </Stack>
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
