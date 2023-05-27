import { FC, useCallback, useState } from "react";
import { DataListAuthorityFluentUI } from "../../components/DataList/DataListAuthorityFluentUi";
import { CommandBarButton, IButtonStyles, IOverflowSetItemProps, IconButton, OverflowSet, Stack } from "@fluentui/react";
import { DataListHakAksesFluentUI } from "../../components/DataList/DataListHakAksesFluentUi";
import { DataListPerusahaanFluentUI } from "../../components/DataList/DataListPerusahaanFluentUi";
import { DataListPersonFluentUI } from "../../components/DataList/DataListPersonFluentUi";
import { DataListModelPerizinanFluentUI } from "../../components/DataList/DataListModelPerizinanFluentUi";
import { DataListSkalaUsahaFluentUI } from "../../components/DataList/DataListSkalaUsahaFluentUi";
import { DataListKategoriPelakuUsahaFluentUI } from "../../components/DataList/DataListKategoriPelakuUsahaFluentUi";

const noOp = () => undefined;
const daftarMenuOverFlow = [
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
        key: 'model_perizinan',
        name: 'Model izin usaha',
        icon: 'FlowChart',
        onClick: undefined,
    },
    {
        key: 'skala_usaha',
        name: 'Skala usaha',
        icon: 'ScaleVolume',
        onClick: undefined,
    },
    {
        key: 'kategori_pelaku_usaha',
        name: 'Kategori pelaku usaha',
        icon: 'RowsGroup',
        onClick: undefined,
    },
]

const buttonStyles: Partial<IButtonStyles> = {
root: {
    minWidth: 0,
    padding: '10px',
    alignSelf: 'stretch',
    height: 'auto',
},
};

export const MasterBackEnd: FC = () => {

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
                    title="Skala usaha"
                />;
            break;
        default:
            konten = null;
            break;
    }
    return konten;
};