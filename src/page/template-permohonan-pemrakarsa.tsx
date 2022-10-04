import React, { FC, useCallback, useState } from "react";
import { 
    Breadcrumb, DefaultEffects, FontIcon, IBreadcrumbItem, IStackStyles, IStackTokens, 
    Label, 
    mergeStyles, mergeStyleSets, Stack 
} from "@fluentui/react";
import { PermohonanArahan } from "./permohonan/template-arahan";

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
    cursor: 'pointer',
};
const containerDivInformationStyles: React.CSSProperties = {  
    marginTop: 16, 
    // border: '1px solid red',
    borderTop: '2px solid red', 
    // borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    boxShadow: DefaultEffects.elevation4,
    padding: 16,
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

const getSubKontenPermohonan = (jenisPermohonan: string) => {
    let konten = null;
    switch (jenisPermohonan) {
        case 'arahan':
            konten = <PermohonanArahan />;
            break;    
        default:
            break;
    }
    return konten;
}

export const KontenPermohonanPemrakarsa: FC = () => {
    const resetPagePermohonan = useCallback(
        () => {
            setIsSubmenu(true);
            setSubKontenPermohonan(undefined);
            setItemBreadcrumb([
                { text: 'Permohonan', key: 'pmh', onClick: resetPagePermohonan},
            ]);
        },
        []
    );

    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        { text: 'Permohonan', key: 'pmh', onClick: resetPagePermohonan},
    ]);
    const [isSubmenu, setIsSubmenu] = useState<boolean>(true);
    const [subKontenPermohonan, setSubKontenPermohonan] = useState<string|undefined>(undefined);

    const handleOnClickSubMenu = useCallback(
        (jenisPermohonan: string) => {
            setIsSubmenu(false);
            setSubKontenPermohonan(jenisPermohonan);
            setItemBreadcrumb([
                { text: 'Permohonan', key: 'pmh', onClick: resetPagePermohonan},
                { text: 'Arahan', key: 'arh'},
            ]);
        },
        []
    );
    
    return (
        <>
        {
            isSubmenu && 
            <Stack styles={kontenStyles} tokens={kontenStackTokens}>
                <Stack.Item align="auto">                
                    <Breadcrumb
                        items={itemBreadcrumb}
                        maxDisplayedItems={3}
                        ariaLabel="Breadcrumb permohonan"
                        overflowAriaLabel="More links"
                    />
                </Stack.Item>
                <Stack.Item 
                    grow 
                    align="auto" 
                    style={containerDivStyles} 
                    onClick={(e) => (handleOnClickSubMenu('arahan'))}
                >
                    <Stack horizontal tokens={kontenStackTokens}>
                        <Stack.Item align="center">
                            <FontIcon aria-label="Assign" iconName="Assign" className={classNames.deepSkyBlue} />
                        </Stack.Item>
                        <Stack.Item grow>
                            ARAHAN PEMBUATAN DOKUMEN LINGKUNGAN HIDUP (ARAHAN)
                        </Stack.Item>
                        <Stack.Item align="center">
                            <FontIcon aria-label="Compass" iconName="ChevronRight" className={classNames.deepSkyBlue16} />
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
                <Stack.Item 
                    grow 
                    align="auto" 
                    style={containerDivStyles}
                    onClick={(e) => (handleOnClickSubMenu('sppl'))}
                >
                    <Stack horizontal tokens={kontenStackTokens}>
                        <Stack.Item align="center">
                            <FontIcon aria-label="Mail" iconName="Mail" className={classNames.deepSkyBlue} />
                        </Stack.Item>
                        <Stack.Item grow>                        
                            SURAT PERNYATAAN KESANGGUPAN PENGELOLAAN LINGKUNGAN (SPPL)
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
                            UPAYA PENGELOLAAN LINGKUNGAN (UKL) DAN UPAYA PEMANTAUAN LINGKUNGAN (UPL)
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
                            PERSETUJUAN TEKNIS PEMENUHAN BAKU MUTU AIR LIMBAH (PERTEK BMAL)
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
                            PERSETUJUAN TEKNIS PENGOLAHAN LIMBAH B3 (PERTEK LIMBAH B3)
                        </Stack.Item>
                        <Stack.Item align="center">
                            <FontIcon aria-label="Compass" iconName="ChevronRight" className={classNames.deepSkyBlue16} />
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
                <Stack.Item grow align="auto" style={containerDivInformationStyles}>
                    <Label>Perhatian!</Label>
                </Stack.Item>
            </Stack>
            
        }
        {
            !isSubmenu && (
            <Stack styles={kontenStyles} tokens={kontenStackTokens}>
                <Stack.Item align="auto">                
                    <Breadcrumb
                        items={itemBreadcrumb}
                        maxDisplayedItems={3}
                        ariaLabel={`Breadcrumb permohonan ${subKontenPermohonan}`}
                        overflowAriaLabel="More links"
                    />
                </Stack.Item>
                <Stack.Item 
                    grow 
                    align="auto" 
                    style={containerDivStyles}
                >
                    {
                        getSubKontenPermohonan(subKontenPermohonan!)
                    }
                </Stack.Item>
            </Stack>            
            )
        }
        </>
    );
}