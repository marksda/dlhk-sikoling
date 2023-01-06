import { DocumentCard, DocumentCardPreview, DocumentCardStatus, DocumentCardTitle, DocumentCardType, getTheme, IDocumentCardPreviewProps, IStackTokens, Stack } from "@fluentui/react";
import omit from "lodash.omit";
import { FC, useCallback, useMemo, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { DataListFlowLogFluentUI } from "../../../components/DataList/log/DataListFlowLogFluentUi";
import { IListItemFlowLog } from "../../../components/DataList/log/InterfaceDataListFlowLog";
import { useGetAllFlowLogQuery } from "../../../features/log/flow-log-api-slice";
import { ListDetailMessage } from "./template-list-message";

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

type daftarItemFlowLog = IListItemFlowLog[];

export const DashboardDefault: FC<IKontenDashboardDefaultProps> = ({setParentPage}) => {
    //redux global state
    const token = useAppSelector(state => state.token);
    //rtk query perusahaan variable hook
    const { data: daftarFlowLog, error: errorFetchDataFlowLog,  isFetching: isFetchingDataFlowLog, isError } = useGetAllFlowLogQuery();
    
    const dataFlowLog: daftarItemFlowLog = useMemo(
        () => {
            if(daftarFlowLog != undefined) {
                return [
                    ...daftarFlowLog.map(
                        (t) => (
                            {key: t.id as string, ...omit(t, ['id'])}
                        )
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarFlowLog]
    );

    const handleOnClickCardItem = useCallback(
        (e?: React.SyntheticEvent<HTMLElement>) => {
            if(e != undefined) {
                setParentPage(e.currentTarget.attributes[2].value);
            }
        },
        []
    );
    
    return(
        <Stack tokens={stackTokens}>
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
            <Stack.Item>
                <DataListFlowLogFluentUI
                    dataFlowLog={dataFlowLog}
                />
            </Stack.Item>
        </Stack>
    );
};