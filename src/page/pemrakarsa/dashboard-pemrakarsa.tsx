import { CommandBarButton, IButtonStyles, IOverflowSetItemProps,  IconButton,  OverflowSet,  Stack } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { DataListFlowLogFluentUI } from "../../components/DataList/DataListFlowLogFluentUi";
import { DataListPermohonanFluentUI } from "../../components/DataList/DataListPermohonanFluentUI";
import { DataListRegisterPerusahaanFluentUI } from "../../components/DataList/DataListRegisterPerusahaanFluentUi";
import { DataListRegisterDokumenFluentUI } from "../../components/DataList/DataListRegisterDokumenFluentUI";


interface IDashboatdPemrakarsaFluentUIProps {
    idUser: string;
};
const buttonStyles: Partial<IButtonStyles> = {
    root: {
        minWidth: 0,
        padding: '10px',
        alignSelf: 'stretch',
        height: 'auto',
    },
};

const daftarMenuOverFlow = [
    {
        key: 'notifikasi',
        name: 'Notifikasi',
        icon: 'Info',
        onClick: undefined,
    },
    {
        key: 'tracking_log',
        name: 'Tracking log',
        icon: 'History',
        onClick: undefined,
    },
    {
        key: 'perusahaan',
        name: 'Perusahaan',
        icon: 'CityNext',
        onClick: undefined,
    },
    {
        key: 'dokumen',
        name: 'Dokumen',
        icon: 'Boards',
        onClick: undefined,
    }
];

export const KontenDashboardPemrakarsa: FC<IDashboatdPemrakarsaFluentUIProps> = ({idUser}) => {
    //local state    
    const [idContentPage, setIdContentPage] = useState<string>('permohonan');

    const kontentPage = useMemo(
        () => {
            let konten = null;
            switch (idContentPage) {
                case 'tracking_log':
                    konten =             
                        <DataListFlowLogFluentUI 
                            initSelectedFilters={
                                {
                                    pageNumber: 1,
                                    pageSize: 25,
                                    filters: [],
                                    sortOrders: [
                                        {
                                            fieldName: 'tanggal',
                                            value: 'DESC'
                                        },
                                    ],
                                }
                            }
                            title="Tracking log"
                        /> 
                    break; 
                case 'permohonan':
                    konten =
                        <DataListPermohonanFluentUI
                            initSelectedFilters={
                                {
                                    pageNumber: 1,
                                    pageSize: 50,
                                    filters: [],
                                    sortOrders: [
                                        {
                                            fieldName: 'tanggal_registrasi',
                                            value: 'DESC'
                                        },
                                    ],
                                }
                            }
                            title="Permohonan"
                        />;
                    break;
                case 'pelaporan':
                    konten = null;
                    break;
                case 'perusahaan':
                    konten = <DataListRegisterPerusahaanFluentUI 
                            initSelectedFilters={
                                {
                                    pageNumber: 1,
                                    pageSize: 25,
                                    filters: [
                                        {
                                            fieldName: 'kepemilikan',
                                            value: idUser
                                        }
                                    ],
                                    sortOrders: [
                                        {
                                            fieldName: 'tanggal_registrasi',
                                            value: 'DESC'
                                        },
                                    ],
                                }
                            }
                            title="Perusahaan"
                        />;
                    break;
                case 'dokumen':
                    konten =
                        <DataListRegisterDokumenFluentUI
                            initSelectedFilters={
                                {
                                    pageNumber: 1,
                                    pageSize: 25,
                                    filters: [
                                        {
                                            fieldName: 'kepemilikan_perusahaan',
                                            value: idUser
                                        }
                                    ],
                                    sortOrders: [
                                        {
                                            fieldName: 'tanggalRegistrasi',
                                            value: 'DESC'
                                        },
                                    ],
                                }
                            }
                            title="Dokumen"
                        />;
                    break;   
                default:
                    konten = null;
                    break;
            }
            return konten;
        },
        [idContentPage, idUser]
    );

    const onRenderItem = useCallback(
        (item: IOverflowSetItemProps): JSX.Element => {
        if (item.onRender) {
            return item.onRender(item);
        }
        return <CommandBarButton 
                styles={buttonStyles} 
                iconProps={{ iconName: item.icon }} 
                menuProps={item.subMenuProps} 
                text={item.name} 
                onClick={() => _onHandleMasterMenu(item.key)}
            />;
        },
        []
    );

    const  _onHandleMasterMenu = useCallback( 
        (val) => {
            setIdContentPage(val);
        },
        []
    );

    const _onRenderOverflowButton = useCallback(
        (overflowItems: any[] | undefined): JSX.Element => {
            const buttonStyles: Partial<IButtonStyles> = {
            root: {
                minWidth: 0,
                padding: '0 4px',
                alignSelf: 'stretch',
                height: 'auto',
            },
            };
            return (
            <IconButton
                title="More options"
                styles={buttonStyles}
                menuIconProps={{ iconName: 'More' }}
                menuProps={{ items: overflowItems! }}
            />
            );
        },
        []
    );

    return (        
        <Stack grow verticalFill>
            <Stack.Item style={{marginTop: -2, marginBottom: 4, borderBottom: '1px solid #e5e5e5'}}>
                <OverflowSet
                    aria-label="dashboar pemrakarsa"
                    items={daftarMenuOverFlow}
                    onRenderItem={onRenderItem}
                    onRenderOverflowButton={_onRenderOverflowButton}
                />
            </Stack.Item>
            <Stack.Item grow>
                {kontentPage}
            </Stack.Item>
        </Stack>
    );
};