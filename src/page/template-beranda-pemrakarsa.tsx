import { Breadcrumb, DefaultEffects, IBreadcrumbItem, IStackStyles, Stack } from "@fluentui/react";
import { FC, useState } from "react";

const kontenStyles: IStackStyles = {
    root: {
        padding: '0px 16px',        
    },
};
const containerDivStyles: React.CSSProperties = {    
    // boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 48,
    background: 'white',
};

export const KontenBerandaPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Beranda', key: 'brd', href:''
        }
    ]);
    
    return(
        <Stack styles={kontenStyles}>
            <Stack.Item align="auto">                
                <Breadcrumb
                    items={itemBreadcrumb}
                    maxDisplayedItems={3}
                    ariaLabel="Breadcrumb beranda"
                    overflowAriaLabel="More links"
                />
            </Stack.Item>
            <Stack.Item grow align="auto">   
                <div style={containerDivStyles}>
                    
                </div>   
            </Stack.Item>
        </Stack>
    );
}