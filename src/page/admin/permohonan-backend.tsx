import { CommandBarButton, IButtonStyles, ILabelStyles, IOverflowSetItemProps, IStyleSet, IconButton, Label, OverflowSet, Pivot, PivotItem, Stack, mergeStyleSets } from "@fluentui/react";
import { FC, useCallback, useMemo, useState } from "react";
import { DataListPermohonanFluentUI } from "../../components/DataList/DataListPermohonanFluentUI";

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
};

const buttonStyles: Partial<IButtonStyles> = {
    root: {
        minWidth: 0,
        padding: '10px',
        alignSelf: 'stretch',
        height: 'auto',
    },
};

export const PermohonanBackEnd: FC = () => {
    const daftarMenuOverFlow = useMemo(
        () => {
            return [
                {
                    key: 'tracking_log',
                    name: 'Tracking log',
                    icon: 'Shield',
                    onClick: undefined,
                },
            ]
        },
        []
    );

    const [idContentPage, setIdContentPage] = useState<string>('tracking_log');

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
                    aria-label="Custom Example"
                    items={daftarMenuOverFlow}
                    onRenderItem={onRenderItem}
                    onRenderOverflowButton={_onRenderOverflowButton}
                />
            </Stack.Item>
            <Stack.Item grow>
                <Pivot>
                    <PivotItem
                        headerText="Permohonan masuk"
                        headerButtonProps={{
                        'data-order': 1,
                        'data-title': 'baru',
                        }}
                        itemIcon="DownloadDocument"
                        style={{padding: 4, height: window.innerHeight - 115}}
                    >
                        <DataListPermohonanFluentUI
                            initSelectedFilters={
                                {
                                    pageNumber: 1,
                                    pageSize: 50,
                                    filters: [
                                        {
                                            fieldName: 'posisi_tahap_pemberkasan_penerima',
                                            value: '1'
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
                            title="Permohonan masuk"
                        />
                    </PivotItem>
                    <PivotItem 
                        headerText="Permohonan keluar"
                        itemIcon="Generate"
                    >
                        <Label styles={labelStyles}>Pivot #2</Label>
                    </PivotItem>
                    <PivotItem 
                        headerText="Permohonan selesai"
                        itemIcon="DocumentApproval"    
                    >
                        <Label styles={labelStyles}>Pivot #3</Label>
                    </PivotItem>
                    <PivotItem 
                        headerText="Permohonan tertolak"
                        itemIcon="PageRemove"
                    >
                        <Label styles={labelStyles}>Pivot #3</Label>
                    </PivotItem>
                </Pivot>
            </Stack.Item>
        </Stack>
    )
};
