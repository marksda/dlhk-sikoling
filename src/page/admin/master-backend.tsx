import { FC, useCallback, useMemo, useState } from "react";
import { DataListAuthorityFluentUI } from "../../components/DataList/DataListAuthorityFluentUi";
import { CommandBarButton, IButtonStyles, IOverflowSetItemProps, IconButton, OverflowSet, Stack } from "@fluentui/react";
import { DataListHakAksesFluentUI } from "../../components/DataList/DataListHakAksesFluentUi";
import { DataListPerusahaanFluentUI } from "../../components/DataList/DataListPerusahaanFluentUi";
import { DataListPersonFluentUI } from "../../components/DataList/DataListPersonFluentUi";
import { DataListModelPerizinanFluentUI } from "../../components/DataList/DataListModelPerizinanFluentUi";
import { DataListSkalaUsahaFluentUI } from "../../components/DataList/DataListSkalaUsahaFluentUi";
import { DataListKategoriPelakuUsahaFluentUI } from "../../components/DataList/DataListKategoriPelakuUsahaFluentUi";
import { DataListKategoriLogFluentUI } from "../../components/DataList/DataListKategoriLogFluentUi";
import { DataListStatusFlowLogFluentUI } from "../../components/DataList/DataListStatusFlowLogFluentUi";
import { DataListPelakuUsahaFluentUI } from "../../components/DataList/DataListPelakuUsahaFluentUi";

// const noOp = () => undefined;


const buttonStyles: Partial<IButtonStyles> = {
root: {
    minWidth: 0,
    padding: '10px',
    alignSelf: 'stretch',
    height: 'auto',
},
};

export const MasterBackEnd: FC = () => {

    const daftarMenuOverFlow = useMemo(
        () => {
            return [
                {
                    key: 'authority',
                    name: 'Authority',
                    icon: 'AuthenticatorApp',
                    onClick: undefined,
                },
                {
                    key: 'hak_akses',
                    name: 'Hak akses',
                    icon: 'Database',
                    onClick: undefined,
                },
                {
                    key: 'identity',
                    name: 'Identitas personal',
                    icon: 'Album',
                    onClick: undefined,
                },
                {
                    key: 'pemrakarsa',
                    name: 'Pemrakarsa',
                    icon: 'CityNext',
                    onClick: undefined,
                },
                {
                    key: 'usaha',
                    name: 'Usaha',
                    icon: 'ExpandMenu',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'model_perizinan',
                                name: 'Model izin usaha',
                                iconProps: {iconName: 'HomeGroup'},
                                onClick: () => {
                                    _onHandleMasterMenu('model_perizinan');
                                }
                            },            
                            {
                                key: 'skala_usaha',
                                name: 'Skala usaha',
                                iconProps: {iconName:'ScaleVolume'},
                                onClick: () => {
                                    _onHandleMasterMenu('skala_usaha');
                                },
                            },
                            {
                                key: 'kategori_pelaku_usaha',
                                name: 'Kategori pelaku usaha',
                                iconProps: {iconName:'Quantity'},
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_pelaku_usaha');
                                }
                            },
                            {
                                key: 'pelaku_usaha',
                                name: 'Pelaku usaha',
                                iconProps: {iconName:'ContactInfo'},
                                onClick: () => {
                                    _onHandleMasterMenu('pelaku_usaha');
                                }
                            },
                        ]
                    },
                },
                {
                    key: 'log',
                    name: 'Log',
                    icon: 'History',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'kategori_log',
                                name: 'Kategori Log',
                                iconProps: { iconName: 'Backlog' },
                                onClick: () => {
                                        _onHandleMasterMenu('kategori_log');
                                }
                            },
                            {
                                key: 'status_flow_log',
                                name: 'Status flow log',
                                iconProps: { iconName: 'StatusCircleRing' },
                                onClick: () => {
                                    _onHandleMasterMenu('status_flow_log');
                                }
                            },                            
                        ],
                    },
                },
                {
                    key: 'alamat',
                    name: 'Alamat',
                    icon: 'Nav2DMapView',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'propinsi',
                                name: 'Propinsi',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                        _onHandleMasterMenu('kategori_log');
                                    }
                            },
                            {
                                key: 'kabupaten',
                                name: 'Kabupaten',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_log');
                                }
                            },
                            {
                                key: 'kecamatan',
                                name: 'Kecamatan',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_log');
                                }
                            },
                            {
                                key: 'desa',
                                name: 'Desa',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_log');
                                }
                            },
                        ],
                    },
                },
                {
                    key: 'permohonan',
                    name: 'Permohonan',
                    icon: 'PublishCourse',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'kategori_permohonan',
                                name: 'Jenis permohonan',
                                iconProps: { iconName: 'WebComponents' },
                                onClick: () => {
                                        _onHandleMasterMenu('kategori_permohonan');
                                    }
                            },
                            {
                                key: 'kategori_pengurus_permohonan',
                                name: 'Jenis pengurus permohonan',
                                iconProps: { iconName: 'Group' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_pengurus_permohonan');
                                }
                            },
                            {
                                key: 'tahap_pemberkasan',
                                name: 'Tahap permohonan',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_log');
                                }
                            },
                        ],
                    },
                },
            ]
        },
        []
    )

    const [idContentPage, setIdContentPage] = useState<string>('authority');

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

    const onRenderOverflowButton = useCallback(
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

    const  _onHandleMasterMenu = useCallback( 
        (val) => {
            setIdContentPage(val);
        },
        []
    );

    return (
        <Stack grow verticalFill>
            <Stack.Item style={{marginTop: -2, marginBottom: 4, borderBottom: '1px solid #e5e5e5'}}>
                <OverflowSet
                    aria-label="Custom Example"
                    items={daftarMenuOverFlow}
                    onRenderItem={onRenderItem}
                    onRenderOverflowButton={onRenderOverflowButton}
                />
            </Stack.Item>
            <Stack.Item grow>
                {getContentPage(idContentPage)}
            </Stack.Item>
        </Stack>
        
    )
};

const getContentPage = (idContentPage: string) => {
    let konten = null;
    switch (idContentPage) {
        case 'authority':
            konten =             
                <DataListAuthorityFluentUI
                    title="Authority"
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
                />;
            break; 
        case 'hak_akses':
                konten = <DataListHakAksesFluentUI
                    title="Hak akses"
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                />;
                break; 
        case 'pemrakarsa':
            konten = <DataListPerusahaanFluentUI 
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
                    title="Pemrakarsa"
                />;
            break;
        case 'identity':
            konten = <DataListPersonFluentUI 
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'nik',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Identitas personal"
                />;
            break;
        case 'model_perizinan':
            konten = <DataListModelPerizinanFluentUI 
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Model izin usaha"
                />;
            break;
        case 'skala_usaha':
            konten = <DataListSkalaUsahaFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Skala usaha"
                />;
            break;
        case 'kategori_pelaku_usaha':
            konten = <DataListKategoriPelakuUsahaFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kategori pelaku usaha"
                />;
            break;
        case 'pelaku_usaha':
            konten = <DataListPelakuUsahaFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Pelaku usaha"
                />;
            break;
        case 'kategori_log':
            konten = <DataListKategoriLogFluentUI
                initSelectedFilters={
                    {
                        pageNumber: 1,
                        pageSize: 50,
                        filters: [],
                        sortOrders: [
                            {
                                fieldName: 'id',
                                value: 'ASC'
                            },
                        ],
                    }
                }
                title="Kategori log"
            />;
            break;
        case 'status_flow_log':
            konten = <DataListStatusFlowLogFluentUI
                initSelectedFilters={
                    {
                        pageNumber: 1,
                        pageSize: 50,
                        filters: [],
                        sortOrders: [
                            {
                                fieldName: 'id',
                                value: 'ASC'
                            },
                        ],
                    }
                }
                title="Status flow log"
            />;
            break;
        default:
            konten = null;
            break;
    }
    return konten;
};