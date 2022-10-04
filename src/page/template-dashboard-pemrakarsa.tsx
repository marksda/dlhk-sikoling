import { Breadcrumb, DefaultEffects, DocumentCard, DocumentCardLogo, DocumentCardType, IBreadcrumbItem, IDocumentCardLogoProps, IDocumentCardStyles, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC, useState } from "react";
import { ListDetailMessage } from "./dashboard/template-list-message";

const stackTokens: IStackTokens = { childrenGap: 1 };
const kontenStyles: IStackStyles = {
    root: {
        padding: '0px 16px',        
    },
};
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
const cardStyles: IDocumentCardStyles = {
    root: { display: 'inline-block', marginRight: 20, width: 120 },
};
const logoProps: IDocumentCardLogoProps = {
    logoIcon: 'OutlookLogo',
};
const logoPerusahaanProps: IDocumentCardLogoProps = {
    logoIcon: 'CityNext',
};

export const KontenDashboardPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Dashboard', key: 'dsh', href:''
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
                    <Stack tokens={stackTokens}>
                        <Stack.Item>
                            <Stack horizontal tokens={stackTokens}>
                                <DocumentCard
                                    aria-label="Perusahaan"
                                    styles={cardStyles}
                                    onClickHref="http://bing.com"
                                >
                                    <DocumentCardLogo {...logoPerusahaanProps} />
                                </DocumentCard>
                                <DocumentCard
                                    aria-label="Permohonan"
                                    styles={cardStyles}
                                    onClickHref="http://bing.com"
                                >
                                    <DocumentCardLogo {...logoProps} />
                                </DocumentCard>
                            </Stack>
                        </Stack.Item>
                        <Stack.Item>
                            <ListDetailMessage />
                        </Stack.Item>
                    </Stack>
                </div>   
            </Stack.Item>
        </Stack>
    );
}