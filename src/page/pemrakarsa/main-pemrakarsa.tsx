import { INavLinkGroup, Stack, mergeStyleSets } from "@fluentui/react";
import { FC, useEffect, useMemo, useState } from "react";
import { KontenDashboardPemrakarsa } from "./dashboard-pemrakarsa";
import { KontenPelaporanPemrakarsa } from "./template-pelaporan-pemrakarsa";
import { KontenPermohonanPemrakarsa } from "./template-permohonan-pemrakarsa";
import { TopBarLayoutFluentUI } from "../../components/Layout/TopBarLayoutFluentUI";
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
        name: 'Beranda',
        url: '',
        icon: 'Home',
        key: 'Beranda',
        isExpanded: true,
        target: '_self',
      },
      {
        name: 'Data Permohonan',
        url: '',
      //   url: 'http://localhost:3000/pemrakarsa/permohonan',
        icon: 'ChangeEntitlements',
        key: 'pmh',
        isExpanded: true,
        target: '_self',
      },
      {
        name: 'Data Pelaporan',
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
        name: 'Data Perusahaan',
        url: '',
        icon: 'CityNext',
        key: 'Data Perusahaan',
        target: '_blank',
      },
      {
        name: 'Arsip Dokumen',
        url: '',
        icon: 'Boards',
        key: 'Arsip Dokumen',
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

export const PemrakarsaPage: FC = () => {
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
          case 'Beranda':
              konten =             
                <KontenDashboardPemrakarsa idUser={token.userId!}/>;
              break; 
          case 'pmh':
              konten = <KontenPermohonanPemrakarsa />;   
              break;
          case 'plp':
              konten = <KontenPelaporanPemrakarsa />;   
              break;
          default:
              konten =null;
              break;
      }
      return konten;
    },
    [idContentPage, token]
  );
  
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
      ) : null
    }
    </>
  );
       
};

// const getContentPage = (idContentPage: string, idUser: string) => {
//   let konten = null;
//   switch (idContentPage) {
//       case 'Dashboard':
//           konten =             
//             <KontenDashboardPemrakarsa />;
//           break; 
//       case 'pmh':
//           konten = <KontenPermohonanPemrakarsa />;   
//           break;
//       case 'plp':
//           konten = <KontenPelaporanPemrakarsa />;   
//           break;
//       default:
//           konten = <KontenDashboardPemrakarsa />;
//           break;
//   }
//   return konten;
// };
