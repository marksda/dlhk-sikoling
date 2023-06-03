import { Breadcrumb,  CommandBarButton,  IBreadcrumbItem,  IButtonStyles,  IOverflowSetItemProps,  IconButton,  OverflowSet,  Stack } from "@fluentui/react";
import { useCallback, useMemo, useState } from "react";
import { DashboardDefault } from "./dashboard/dashboard-default";
import { KontenDashboardPerusahaan } from "./dashboard/dashboard-perusahaan";
import find from "lodash.find";
import cloneDeep from "lodash.clonedeep";
import { DataListFlowLogFluentUI } from "../../components/DataList/DataListFlowLogFluentUi";
import { DataListPermohonanFluentUI } from "../../components/DataList/DataListPermohonanFluentUI";
import { DataListPerusahaanFluentUI } from "../../components/DataList/DataListPerusahaanFluentUi";

const _daftarBreadCrumb = [
    {key: 'default', value: [{text: 'Dashboard', key: 'dashboard-default'}]},
    {key: 'Perusahaan', value: [
        {text: 'Dashboard', key: 'default'},
        {text: 'Perusahaan', key: 'Perusahaan'}
    ]},
    
];

const buttonStyles: Partial<IButtonStyles> = {
    root: {
        minWidth: 0,
        padding: '10px',
        alignSelf: 'stretch',
        height: 'auto',
    },
};

export const KontenDashboardPemrakarsa = () => {
    const daftarMenuOverFlow = useMemo(
        () => {
            return [
                {
                    key: 'permohonan',
                    name: 'Permohonan',
                    icon: 'PublishCourse',
                    onClick: undefined,
                },
                {
                    key: 'permohonan',
                    name: 'Pelaporan',
                    icon: 'AnalyticsReport',
                    onClick: undefined,
                },
                {
                    key: 'pemrakarsa',
                    name: 'Pemrakarsa',
                    icon: 'CityNext',
                    onClick: undefined,
                },
                {
                    key: 'tracking_log',
                    name: 'Tracking log',
                    icon: 'History',
                    onClick: undefined,
                },
            ]
        },
        []
    );

    const [idContentPage, setIdContentPage] = useState<string>('permohonan');

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
            console.log(val);
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
    //local state    
    const [selectedPage, setSelectedPage] = useState<string>('default');
    // const [selectedBreadCrumb, setSelectedBreadCrumb] = useState<Array<any>>([]);

    const selectedBreadCrumb: IBreadcrumbItem[] = useMemo(
        () => {
            let breadCrumbObject;
            let arrayBreadCrumb: IBreadcrumbItem[];
            switch (selectedPage) {
                case 'default':
                    breadCrumbObject = find(_daftarBreadCrumb, (item) => (item.key == selectedPage));
                    arrayBreadCrumb = cloneDeep(breadCrumbObject?.value) as IBreadcrumbItem[];
                    break;
                case 'Perusahaan':
                    breadCrumbObject = find(_daftarBreadCrumb, (item) => (item.key == selectedPage));
                    arrayBreadCrumb = cloneDeep(breadCrumbObject?.value) as Array<IBreadcrumbItem> ; 
                    arrayBreadCrumb[0].onClick = (e, i) => setSelectedPage(i?.key!);
                    break;
                default:
                    arrayBreadCrumb = []
                    break;
            }

            return arrayBreadCrumb;
        },
        [selectedPage]
    );

    // const konten = useMemo(
    //     () => {
    //         let kontenTerpilih;
    //         switch (selectedPage) {
    //             case 'default':
    //                 kontenTerpilih = <DashboardDefault setParentPage={setSelectedPage}/>;
    //                 break;
    //             case 'Perusahaan':
    //                 kontenTerpilih = <KontenDashboardPerusahaan/>;
    //                 break;
    //             default:
    //                 kontenTerpilih = null;
    //                 break;
    //         }

    //         return kontenTerpilih;
    //     },
    //     [selectedPage]
    // );

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
                {getContentPage(idContentPage)}
            </Stack.Item>
        </Stack>        
    );
};

const getContentPage = (idContentPage: string) => {
    let konten = null;
    switch (idContentPage) {
        case 'tracking_log':
            konten =             
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
        default:
            konten = null;
            break;
    }
    return konten;
};