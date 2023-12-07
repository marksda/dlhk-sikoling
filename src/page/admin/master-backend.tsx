import { FC, useCallback, useMemo, useState } from "react";
import { DataListOtoritasFluentUI } from "../../components/DataList/DataListOtoritasFluentUi";
import { CommandBarButton, IButtonStyles, IOverflowSetItemProps, IconButton, OverflowSet, Stack } from "@fluentui/react";
import { DataListHakAksesFluentUI } from "../../components/DataList/DataListHakAksesFluentUi";
import { DataListRegisterPerusahaanFluentUI } from "../../components/DataList/DataListRegisterPerusahaanFluentUi";
import { DataListPersonFluentUI } from "../../components/DataList/DataListPersonFluentUi";
import { DataListModelPerizinanFluentUI } from "../../components/DataList/DataListModelPerizinanFluentUi";
import { DataListSkalaUsahaFluentUI } from "../../components/DataList/DataListSkalaUsahaFluentUi";
import { DataListKategoriPelakuUsahaFluentUI } from "../../components/DataList/DataListKategoriPelakuUsahaFluentUi";
import { DataListKategoriLogFluentUI } from "../../components/DataList/DataListKategoriLogFluentUi";
import { DataListStatusFlowLogFluentUI } from "../../components/DataList/DataListStatusFlowLogFluentUi";
import { DataListPelakuUsahaFluentUI } from "../../components/DataList/DataListPelakuUsahaFluentUi";
import { DataListKategoriPermohonanFluentUI } from "../../components/DataList/DataListKategoriPermohonanFluentUI";
import { DataListStatusPengurusPermohonanFluentUI } from "../../components/DataList/DataListStatusPengurusPermohonanFluentUi";
import { DataListPosisiTahapPemberkasanFluentUI } from "../../components/DataList/DataListPosisiTahapPemberkasanFluentUi";
import { DataListJabatanFluentUI } from "../../components/DataList/DataListJabatanFluentUi";
import { DataListPegawaiFluentUI } from "../../components/DataList/DataListPegawaiFluentUi";
import { DataListDokumenFluentUI } from "../../components/DataList/DataListDokumenFluentUi";
import { DataListMasterKbliFluentUI } from "../../components/DataList/DataListMasterKbliFluentUi";
import { DataListAutorisasiPerusahaanFluentUI } from "../../components/DataList/DataListAutorisasiPerusahaanFluentUi";
import { DataListPropinsiFluentUI } from "../../components/DataList/DataListPropinsiFluentUI";
import { DataListKabupatenFluentUI } from "../../components/DataList/DataListKabupatenFluentUI";
import { DataListKecamatanFluentUI } from "../../components/DataList/DataListKecamatanFluentUI";
import { DataListDesaFluentUI } from "../../components/DataList/DataListDesaFluentUI";
import { DataListRegisterDokumenFluentUI } from "../../components/DataList/DataListRegisterDokumenFluentUI";

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

    const [idContentPage, setIdContentPage] = useState<string>('hak_akses');

    const daftarMenuOverFlow = useMemo(
        () => {
            return [
                {
                    key: 'keamanan',
                    name: 'Akses',
                    icon: 'Shield',
                    onClick: undefined,
                    subMenuProps: {
                        items: [               
                            {
                                key: 'hak_akses',
                                name: 'Hak akses',
                                iconProps: {iconName:'AddLink'},
                                onClick: () => {
                                    _onHandleMasterMenu('hak_akses');
                                }
                            },
                            {
                                key: 'otoritas',
                                name: 'Pengguna',
                                iconProps: { iconName: 'ContactCard'},
                                onClick: () => {
                                    _onHandleMasterMenu('otoritas');
                                }
                            },
                            {
                                key: 'user_perusahaan',
                                name: 'Otoritas perusahaan',
                                iconProps: { iconName: 'ContactLink'},
                                onClick: () => {
                                    _onHandleMasterMenu('user_perusahaan');
                                }
                            },
                        ]
                    }
                }, 
                {
                    key: 'identiras',
                    name: 'Register',
                    icon: 'Album',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'dokumen',
                                name: 'Dokumen',
                                iconProps: {iconName:'Boards'},
                                onClick: () => {
                                    _onHandleMasterMenu('dokumen');
                                }
                            },
                            {
                                key: 'identitas_personal',
                                name: 'Person',
                                iconProps: { iconName: 'Contact'},
                                onClick: () => {
                                    _onHandleMasterMenu('identitas_personal');
                                }
                            },               
                            {
                                key: 'pemrakarsa',
                                name: 'Perusahaan',
                                iconProps: {iconName:'CityNext'},
                                onClick: () => {
                                    _onHandleMasterMenu('pemrakarsa');
                                }
                            },
                            {
                                key: 'pegawai',
                                name: 'Pegawai',
                                iconProps: {iconName:'WorkforceManagement'},
                                onClick: () => {
                                    _onHandleMasterMenu('pegawai');
                                }
                            },
                        ]
                    }
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
                                iconProps: { iconName: 'Event' },
                                onClick: () => {
                                    _onHandleMasterMenu('status_flow_log');
                                }
                            },                            
                        ],
                    },
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
                            {
                                key: 'jabatan',
                                name: 'Jabatan',
                                iconProps: {iconName:'PartyLeader'},
                                onClick: () => {
                                    _onHandleMasterMenu('jabatan');
                                }
                            },
                            {
                                key: 'kbli',
                                name: 'Kbli',
                                iconProps: {iconName:'PartyLeader'},
                                onClick: () => {
                                    _onHandleMasterMenu('kbli');
                                }
                            },
                        ]
                    },
                },
                {
                    key: 'alamat',
                    name: 'Lokasi',
                    icon: 'Nav2DMapView',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'propinsi',
                                name: 'Propinsi',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                        _onHandleMasterMenu('propinsi');
                                    }
                            },
                            {
                                key: 'kabupaten',
                                name: 'Kabupaten',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kabupaten');
                                }
                            },
                            {
                                key: 'kecamatan',
                                name: 'Kecamatan',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('kecamatan');
                                }
                            },
                            {
                                key: 'desa',
                                name: 'Desa',
                                iconProps: { iconName: 'Pinned' },
                                onClick: () => {
                                    _onHandleMasterMenu('desa');
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
                                name: 'Kategori permohonan',
                                iconProps: { iconName: 'WebComponents' },
                                onClick: () => {
                                        _onHandleMasterMenu('kategori_permohonan');
                                    }
                            },
                            {
                                key: 'kategori_pengurus_permohonan',
                                name: 'Kategori pengurus permohonan',
                                iconProps: { iconName: 'Group' },
                                onClick: () => {
                                    _onHandleMasterMenu('kategori_pengurus_permohonan');
                                }
                            },
                            {
                                key: 'posisi_tahap_pemberkasan',
                                name: 'Posisi tahap permohonan',
                                iconProps: { iconName: 'Step' },
                                onClick: () => {
                                    _onHandleMasterMenu('posisi_tahap_pemberkasan');
                                }
                            },
                        ],
                    },
                },
                {
                    key: 'dokumen',
                    name: 'Dokumen',
                    icon: 'DocumentSet',
                    onClick: undefined,
                    subMenuProps: {
                        items: [
                            {
                                key: 'jenis_dokumen',
                                name: 'Jenis dokumen',
                                iconProps: { iconName: 'Group' },
                                onClick: () => {
                                    _onHandleMasterMenu('jenis_dokumen');
                                }
                            }
                        ],
                    },
                },
            ]
        },
        []
    )

    const kontentPage = useMemo(
        () => {
            let konten = null;
            switch (idContentPage) { 
                case 'dokumen':
                konten = <DataListRegisterDokumenFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
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
                case 'desa':
                konten = <DataListDesaFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Desa"
                />;
                break;
                case 'hak_akses':
                konten = <DataListHakAksesFluentUI
                    title="Hak akses"
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
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
                case 'identitas_personal':
                konten = <DataListPersonFluentUI 
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
                                filters: [],
                                sortOrders: [
                                    {
                                        fieldName: 'nik',
                                        value: 'ASC'
                                    },
                                ],
                            }
                        }
                        title="Person"
                    />;
                break;
                case 'jenis_dokumen':
                konten = <DataListDokumenFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'nama',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Jenis dokumen"
                />;
                break;
                case 'kabupaten':
                konten = <DataListKabupatenFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kabupaten"
                />;
                break;
                case 'kategori_log':
                konten = <DataListKategoriLogFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
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
                case 'kategori_pelaku_usaha':
                konten = <DataListKategoriPelakuUsahaFluentUI
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
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
                case 'kategori_pengurus_permohonan':
                konten = <DataListStatusPengurusPermohonanFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kategori pengurus permohonan"
                />;
                break;
                case 'kategori_permohonan':
                konten = <DataListKategoriPermohonanFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kategori permohonan"
                />;
                break;
                case 'kbli':
                konten = <DataListMasterKbliFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'kode',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kbli"
                />;
                break;
                case 'kecamatan':
                konten = <DataListKecamatanFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Kecamatan"
                />;
                break;
                case 'jabatan':
                konten = <DataListJabatanFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'nama',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Jabatan"
                />;
                break;
                case 'model_perizinan':
                konten = <DataListModelPerizinanFluentUI 
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
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
                case 'otoritas':
                konten =             
                    <DataListOtoritasFluentUI
                        title="Pengguna"
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
                    />;
                break;
                case 'pegawai':
                konten = <DataListPegawaiFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'pegawai',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Pegawai"
                />;
                break;
                case 'pelaku_usaha':
                konten = <DataListPelakuUsahaFluentUI
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
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
                case 'pemrakarsa':
                konten = <DataListRegisterPerusahaanFluentUI 
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
                                filters: [],
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
                case 'posisi_tahap_pemberkasan':
                konten = <DataListPosisiTahapPemberkasanFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Posisi tahap permohonan"
                />;
                break;
                case 'propinsi':
                konten = <DataListPropinsiFluentUI
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 25,
                            filters: [],
                            sortOrders: [
                                {
                                    fieldName: 'id',
                                    value: 'ASC'
                                },
                            ],
                        }
                    }
                    title="Propinsi"
                />;
                break;   
                case 'skala_usaha':
                konten = <DataListSkalaUsahaFluentUI
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
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
                case 'status_flow_log':
                    konten = <DataListStatusFlowLogFluentUI
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
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
                case 'user_perusahaan':
                konten = <DataListAutorisasiPerusahaanFluentUI 
                        initSelectedFilters={
                            {
                                pageNumber: 1,
                                pageSize: 25,
                                filters: [],
                                sortOrders: [
                                    {
                                        fieldName: 'perusahaan',
                                        value: 'ASC'
                                    },
                                ],
                            }
                        }
                        title="Otoritas perusahaan"
                    />;
                break;
                default:
                    konten = null;
                    break;
            }
            return konten;
        },
        [idContentPage]
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
                    aria-label="menu"
                    items={daftarMenuOverFlow}
                    onRenderItem={onRenderItem}
                    onRenderOverflowButton={onRenderOverflowButton}
                />
            </Stack.Item>
            <Stack.Item grow>
                {kontentPage}
            </Stack.Item>
        </Stack>        
    );
};