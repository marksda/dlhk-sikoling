import { CommandBar, DefaultEffects, ICommandBarItemProps, IDetailsHeader, IDetailsHeaderProps, IDetailsHeaderStyles, IRenderFunction, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import { DataListPerusahaanFluentUI } from "../../components/DataList/DataListPerusahaanFluentUI";

const containerDivStyles: React.CSSProperties = {    
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 16,
    background: 'white',
    height: 'calc(100vh - 148px)',
    marginLeft: 4,
};
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};
const _items: ICommandBarItemProps[] = [
    {
        key: 'add',
        text: 'Tambah',
        iconProps: { iconName: 'Add' },
        onClick: () => console.log('Share'),
    },
    {
        key: 'add',
        text: 'Ubah',
        iconProps: { iconName: 'Edit' },
        onClick: () => console.log('Share'),
    },
    {
        key: 'add',
        text: 'Hapus',
        iconProps: { iconName: 'Delete' },
        onClick: () => console.log('Share'),
    }
];


export const KontenDashboardPerusahaan: FC = (props) => {
      
    return(
        <div style={containerDivStyles}>
            <Stack horizontal tokens={containerLoginStackTokens} style={{borderBottom : '1px solid rgb(237, 235, 233)'}}>
                <Stack.Item>
                    <CommandBar
                        items={_items}   
                    />
                </Stack.Item>
            </Stack>
            <Stack>
                <DataListPerusahaanFluentUI />
            </Stack>            
        </div>
        
    );
    
}