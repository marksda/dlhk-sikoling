import { Breadcrumb, DefaultEffects, DocumentCard, DocumentCardDetails, DocumentCardPreview, DocumentCardStatus, DocumentCardTitle, DocumentCardType, getTheme, IBreadcrumbItem, IDocumentCardLogoProps, IDocumentCardPreviewProps, IDocumentCardStyles, IStackStyles, IStackTokens, Label, mergeStyles, Stack } from "@fluentui/react";
import { FC, useState } from "react";
import { ListDetailMessage } from "./dashboard/template-list-message";

const stackTokens: IStackTokens = { childrenGap: 16 };
const theme = getTheme();
const { palette, fonts } = theme;
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
const previewPropsUsingIcon: IDocumentCardPreviewProps = {
    previewImages: [
      {
        previewIconProps: {
            iconName: 'CityNext',
            styles: { 
                root: { 
                    fontSize: fonts.xxLarge.fontSize, 
                    color: palette.white 
                } 
            },
        },
        width: 64,
      },
    ],
    styles: { 
        root: {
            height: 64,
        },
        previewIcon: { backgroundColor: palette.themePrimary },
    },
};
const previewPropsUsingIconPermohonan: IDocumentCardPreviewProps = {
    previewImages: [
      {
        previewIconProps: {
            iconName: 'AllApps',
            styles: { 
                root: { 
                    fontSize: fonts.xxLarge.fontSize, 
                    color: palette.white 
                } 
            },
        },
        width: 64,
      },
    ],
    styles: { 
        root: {
            height: 64,
        },
        previewIcon: { backgroundColor: palette.green },
    },
};
const previewPropsUsingIconPelaporan: IDocumentCardPreviewProps = {
    previewImages: [
      {
        previewIconProps: {
            iconName: 'Trackers',
            styles: { 
                root: { 
                    fontSize: fonts.xxLarge.fontSize, 
                    color: palette.white 
                } 
            },
        },
        width: 64,
      },
    ],
    styles: { 
        root: {
            height: 64,
        },
        previewIcon: { backgroundColor: palette.red },
    },
};
const conversationTileStyle: React.CSSProperties = { 
    // height: 182,
    padding: 8, 
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
                                    type={DocumentCardType.compact}
                                    onClickHref="http://bing.com"
                                    styles={{root:{height: 64, minWidth: 204}}}
                                >
                                    <DocumentCardPreview {...previewPropsUsingIcon} />
                                    <div style={conversationTileStyle}>
                                        <DocumentCardTitle 
                                            title="Perusahaan" 
                                            styles={{root: {height: 20, padding: 0}}} 
                                        />
                                        <DocumentCardStatus 
                                            statusIcon="attach" 
                                            status="4 terdaftar"
                                            styles={{root: {margin: 0, paddingRight: 16}}}
                                        />
                                    </div>
                                </DocumentCard>
                                <DocumentCard
                                    aria-label="Permohonan"
                                    type={DocumentCardType.compact}
                                    onClickHref="http://bing.com"
                                    styles={{root:{height: 64, minWidth: 232}}}
                                >
                                    <DocumentCardPreview {...previewPropsUsingIconPermohonan} />
                                    <div style={conversationTileStyle}>
                                        <DocumentCardTitle 
                                            title="Permohonan" 
                                            styles={{root: {height: 20, padding: 0}}} 
                                        />
                                        <DocumentCardStatus 
                                            statusIcon="attach" 
                                            status="4 dalam proses"
                                            styles={{root: {margin: 0, paddingRight: 16}}}
                                        />
                                    </div>
                                </DocumentCard>
                                <DocumentCard
                                    aria-label="Pelaporan"
                                    type={DocumentCardType.compact}
                                    onClickHref="http://bing.com"
                                    styles={{root:{height: 64, minWidth: 242}}}
                                >
                                    <DocumentCardPreview {...previewPropsUsingIconPelaporan} />
                                    <div style={conversationTileStyle}>
                                        <DocumentCardTitle 
                                            title="Pelaporan" 
                                            styles={{root: {height: 20, padding: 0}}} 
                                        />
                                        <DocumentCardStatus 
                                            statusIcon="attach" 
                                            status="4 dalam tinjauan"
                                            styles={{root: {margin: 0, paddingRight: 16}}}
                                        />
                                    </div>
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