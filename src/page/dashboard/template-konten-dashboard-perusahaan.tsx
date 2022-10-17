import { DefaultEffects, IStackTokens, Stack } from "@fluentui/react";
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


export const KontenDashboardPerusahaan: FC = (props) => {
      
    return(
        <div style={containerDivStyles}>
            <Stack horizontal tokens={containerLoginStackTokens}>
                <Stack.Item grow>
                    asdasd
                </Stack.Item>
                <Stack.Item align="center" >
                    SIKOLING   
                </Stack.Item>  
            </Stack>
            <Stack>
                <DataListPerusahaanFluentUI />
            </Stack>            
        </div>
        
    );
    
}