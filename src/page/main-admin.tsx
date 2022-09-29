import { getTheme, INavLinkGroup, INavStyles, IStackItemStyles, IStackStyles, IStackTokens, Nav, Stack } from "@fluentui/react";
import { FC } from "react";

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
        height: 'calc(100vh - 50px)',
        width: '300px',
    },
};
const navStyles: Partial<INavStyles> = {
    root: {
      width: 285,
      height: 'calc(100vh - 50px)',
      boxSizing: 'border-box',
      border: '1px solid #eee',
      overflowY: 'auto',
    },
};
const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: 'Helpdesk',
          url: 'http://example.com',
          expandAriaLabel: 'Expand Helpdesk section',
          links: [
            {
                name: 'Pendaftaran',
                url: 'http://msn.com',
                key: '00',
                target: '_blank',
            },
            {
                name: 'Pendaftaran Online',
                url: 'http://msn.com',
                disabled: true,
                key: '01',
                target: '_blank',
            },
            {
                name: 'Pendaftaran Online',
                url: 'http://msn.com',
                disabled: true,
                key: '02',
                target: '_blank',
            },
            {
                name: 'Data dalam proses',
                url: 'http://msn.com',
                disabled: true,
                key: '03',
                target: '_blank',
            },
            {
                name: 'Data Ditolak',
                url: 'http://msn.com',
                disabled: true,
                key: '04',
                target: '_blank',
            },
          ],
          isExpanded: true,
        },
        {
            name: 'Back Office',
            url: 'http://example.com',
            expandAriaLabel: 'Expand Back Office section',
            links: [
              {
                  name: 'Data Ditolak',
                  url: 'http://msn.com',
                  key: '10',
                  target: '_blank',
              },
              {
                  name: 'Data Dari Helpdesk',
                  url: 'http://msn.com',
                  disabled: true,
                  key: '11',
                  target: '_blank',
              },
              {
                  name: 'Korektor',
                  url: 'http://msn.com',
                  disabled: true,
                  key: '12',
                  target: '_blank',
              },
              {
                  name: 'Edit/Pencetakan Draf',
                  url: 'http://msn.com',
                  disabled: true,
                  key: '13',
                  target: '_blank',
              },
              {
                  name: 'Kasi Verifikasi',
                  url: 'http://msn.com',
                  disabled: true,
                  key: '14',
                  target: '_blank',
              },
              {
                name: 'Kabid Verifikasi',
                url: 'http://msn.com',
                disabled: true,
                key: '15',
                target: '_blank',
            },
            ],
            isExpanded: false,
        },
        {
          name: 'Documents',
          url: 'http://example.com',
          key: 'key3',
          isExpanded: true,
          target: '_blank',
        },
        {
          name: 'Pages',
          url: 'http://msn.com',
          key: 'key4',
          target: '_blank',
        },
        {
          name: 'Notebook',
          url: 'http://msn.com',
          key: 'key5',
          disabled: true,
        },
        {
          name: 'Communication and Media',
          url: 'http://msn.com',
          key: 'key6',
          target: '_blank',
        },
        {
          name: 'News',
          url: 'http://cnn.com',
          icon: 'News',
          key: 'key7',
          target: '_blank',
        },
      ],
    },
  ];

export const AdminPage: FC = () => {

    return (        
        <Stack>
            <Stack horizontal styles={stackStyles}>
                <Stack.Item grow align="center" styles={labelStyles}>
                    Sikoling  
                </Stack.Item>  
            </Stack>
            <Stack horizontal styles={stackMainContainerStyles}>
                <Stack.Item styles={leftPanelStyles}>
                <Nav
                    selectedKey="00"
                    ariaLabel="left menu sikoling"
                    styles={navStyles}
                    groups={navLinkGroups}
                />  
                </Stack.Item>  
                <Stack.Item>
                    <Stack>
                        <Stack.Item>
                            Breadcum
                        </Stack.Item>
                        <Stack.Item>
                            Isi utama
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}
