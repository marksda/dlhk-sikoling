import { DocumentCard, DocumentCardPreview, DocumentCardStatus, DocumentCardTitle, DocumentCardType, getTheme, IDocumentCardPreviewProps, IStackTokens, Stack } from "@fluentui/react";
import { FC, useCallback } from "react";
import { useAppSelector } from "../../../app/hooks";
import { DataListFlowLogFluentUI } from "../../../components/DataList/DataListFlowLogFluentUi";
import { IListItemFlowLog } from "../../../components/DataList/log/InterfaceDataListFlowLog";

const theme = getTheme();
const { palette, fonts } = theme;
const stackTokens: IStackTokens = { childrenGap: 16 };
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

interface IKontenDashboardDefaultProps {
    setParentPage: React.Dispatch<React.SetStateAction<string>>
}

// type daftarItemFlowLog = IListItemFlowLog[];
type daftarItemFlowLog = IListItemFlowLog[];

export const DashboardDefault: FC<IKontenDashboardDefaultProps> = ({setParentPage}) => {
    //redux global state
    const token = useAppSelector(state => state.token);

    const handleOnClickCardItem = useCallback(
        (e?: React.SyntheticEvent<HTMLElement>) => {
            if(e != undefined) {
                setParentPage(e.currentTarget.attributes[2].value);
            }
        },
        []
    );
    
    return(
        <Stack grow verticalFill tokens={stackTokens}>
            <Stack.Item>
                <Stack horizontal tokens={stackTokens}>
                    <DocumentCard
                        aria-label="Perusahaan"
                        type={DocumentCardType.compact}
                        onClick={handleOnClickCardItem}
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
                        onClick={handleOnClickCardItem}
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
                        onClick={handleOnClickCardItem}
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
            <Stack.Item grow>
                <DataListFlowLogFluentUI 
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'tanggal',
                                    value: 'DESC'
                                },
                            ],
                        }
                    }
                    title="Log tracking"
                /> 
            </Stack.Item>
        </Stack>
    );
};