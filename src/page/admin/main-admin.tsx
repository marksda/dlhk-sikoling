import { INavLinkGroup, Stack, mergeStyleSets } from "@fluentui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { TopBarLayoutFluentUI } from "../../components/Layout/TopBarLayoutFluentUI";
import { DashboardBackEnd } from "./dashboard-backend";
import { PermohonanBackEnd } from "./permohonan-backend";
import { KontenDashboardPemrakarsa } from "../pemrakarsa/dashboard-pemrakarsa";
import { KontenPelaporanPemrakarsa } from "../pemrakarsa/template-pelaporan-pemrakarsa";
import { MasterBackEnd } from "./master-backend";
import { LeftMenuFluentUI } from "../../components/menu/LeftMenuFluentUI";


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
    background: 'rgb(251 251 251)',
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
          key: 'Dashboard',
          isExpanded: true,
          target: '_self',
        },
        {
          name: 'Permohonan',
          url: '',
          icon: 'ChangeEntitlements',
          key: 'Permohonan',
          isExpanded: true,
          target: '_self',
        },
        {
          name: 'Pelaporan',
          url: '',
          icon: 'ReportDocument',
          key: 'Pelaporan',
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
          name: 'Master data',
          url: '',
          icon: 'Library',
          key: 'Master data',
          target: '_blank',
        },
        {
          name: 'Pengaturan',
          url: '',
          icon: 'Settings',
          key: 'Pengaturan',
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

  const kontentPage = useMemo(
    () => {
        let konten = null;
        switch (idContentPage) {
          case 'Dashboard':
            konten =             
              <DashboardBackEnd />;
            break; 
          case 'Permohonan':
              konten = <PermohonanBackEnd />;   
              break;
          case 'Pelaporan':
              konten = <KontenPelaporanPemrakarsa />;   
              break;
          case 'Master data':
            konten = <MasterBackEnd />;   
            break;
          case 'Pengaturan':
            konten = <span>Settings</span>;   
            break;
          default:
              konten = <KontenDashboardPemrakarsa />;
              break;
        }
        return konten;
    },
    [idContentPage]
  );

  useEffect(
    () => {       
      switch (token.hakAkses) {
        case 'Administrator':
            break;
        case 'Umum':
            navigate("/pemrakarsa");
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
      token.hakAkses == 'Administrator' ? 
      <Stack grow verticalFill className={classNames.container}>
        <TopBarLayoutFluentUI 
          appTitleContainer={{nama: 'SIKOLING', width: 200}}
          subTitle={idContentPage}
        />
        <Stack.Item grow className={classNames.gridContainer}>
          <Stack horizontal>
            <Stack.Item className={classNames.leftKonten}>
              <LeftMenuFluentUI 
                menus={navLinkGroups}
                setIdContentPage={setIdContentPage}
              />
            </Stack.Item>
            <Stack.Item grow className={classNames.mainKonten}>
              {kontentPage}
            </Stack.Item>
          </Stack>
        </Stack.Item>
      </Stack>
      : null
    }
    </>
  );
};