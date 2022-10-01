import { INavLinkGroup, INavStyles, Nav } from "@fluentui/react";
import { FC } from "react";

const navStyles: Partial<INavStyles> = {
    root: {
    //   width: 296,
      height: 'calc(100vh - 68px)',
      boxSizing: 'border-box',
      overflowY: 'auto',
    },
};
const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Beranda',
          url: 'http://example.com',
          icon: 'Home',
          key: 'puh',
          isExpanded: true,
          target: '_blank',
        },
        {
          name: 'Permohonan',
          url: 'http://example.com',
          icon: 'ChangeEntitlements',
          key: 'pmh',
          isExpanded: true,
          target: '_blank',
        },
        {
          name: 'Pelaporan',
          url: 'http://msn.com',
          icon: 'ReportDocument',
          key: 'plp',
          target: '_blank',
        },
        {
          name: 'Pengawasan - SKPL',
          url: 'http://cnn.com',
          icon: 'ComplianceAudit',
          key: 'key7',
          target: '_blank',
        },
        {
          name: 'Bantuan',
          url: 'http://cnn.com',
          icon: 'Dictionary',
          key: 'bnt',
          target: '_blank',
        },
      ],
    },
  ];
export const LeftMenuPage: FC = () => {
    return (
        <Nav
            selectedKey="pmh"
            ariaLabel="left menu sikoling"
            styles={navStyles}
            groups={navLinkGroups}
        />  
    );
}