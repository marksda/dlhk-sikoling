import { FC, useState } from "react";
import { 
    Breadcrumb, DefaultEffects, FontIcon, IBreadcrumbItem, IStackStyles, IStackTokens, 
    mergeStyles, mergeStyleSets, Stack 
} from "@fluentui/react";

const kontenStackTokens: IStackTokens = { childrenGap: 5 };
const kontenStyles: IStackStyles = {
    root: {
        padding: '0px 16px',     
        // maxWidth: 800   
    },
};
const containerDivStyles: React.CSSProperties = {    
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    // borderTop: '2px solid #0078D7', 
    // borderRadius: 3, 
    padding: 8,
    marginLeft: 4,
    background: 'white',
};
const iconClass = mergeStyles({
    fontSize: 32,
    height: 32,
    width: 32,
    margin: '0 8px',
});
const iconClass16 = mergeStyles({
    fontSize: 16,
    height: 16,
    width: 16,
    margin: '0 8px',
});
const classNames = mergeStyleSets({
    deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
    deepSkyBlue16: [{ color: 'deepskyblue' }, iconClass16],
    greenYellow: [{ color: 'greenyellow' }, iconClass, iconClass16],
    salmon: [{ color: 'salmon' }, iconClass, iconClass16],
});

export const KontenPelaporanPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Pelaporan', key: 'plp', href:''
        }
    ]);

    return (
        <Stack styles={kontenStyles} tokens={kontenStackTokens}>
            <Stack.Item align="auto">                
                <Breadcrumb
                    items={itemBreadcrumb}
                    maxDisplayedItems={3}
                    ariaLabel="Breadcrumb pelaporan"
                    overflowAriaLabel="More links"
                />
            </Stack.Item>
            <Stack.Item grow align="auto" style={containerDivStyles}>
                <Stack horizontal tokens={kontenStackTokens}>
                    <Stack.Item align="center">
                        <FontIcon aria-label="PagrLink" iconName="PageLink" className={classNames.deepSkyBlue} />
                    </Stack.Item>
                    <Stack.Item grow>
                        PELAPORAN DOKUMEN LINGKUNGAN HIDUP
                    </Stack.Item>
                    <Stack.Item align="center">
                        <FontIcon aria-label="CRMReport" iconName="CRMReport" className={classNames.deepSkyBlue16} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item grow align="auto" style={containerDivStyles}>
                <Stack horizontal tokens={kontenStackTokens}>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Mail" iconName="Mail" className={classNames.deepSkyBlue} />
                    </Stack.Item>
                    <Stack.Item grow>                        
                        PELAPORAN PEMBUANGAN AIR LIMBAH
                    </Stack.Item>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Compass" iconName="ChevronRight" className={classNames.deepSkyBlue16} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item grow align="auto" style={containerDivStyles}>
                <Stack horizontal tokens={kontenStackTokens}>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Mail" iconName="Mail" className={classNames.deepSkyBlue} />
                    </Stack.Item>
                    <Stack.Item grow>                        
                        PELAPORAN PENYIMPANAN LIMBAH B3
                    </Stack.Item>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Compass" iconName="ChevronRight" className={classNames.deepSkyBlue16} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
            <Stack.Item grow align="auto" style={containerDivStyles}>
                <Stack horizontal tokens={kontenStackTokens}>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Mail" iconName="Mail" className={classNames.deepSkyBlue} />
                    </Stack.Item>
                    <Stack.Item grow>                        
                        PELAPORAN KUALITAS UDARA
                    </Stack.Item>
                    <Stack.Item align="center">
                        <FontIcon aria-label="Compass" iconName="ChevronRight" className={classNames.deepSkyBlue16} />
                    </Stack.Item>
                </Stack>
            </Stack.Item>
        </Stack>
    );
}