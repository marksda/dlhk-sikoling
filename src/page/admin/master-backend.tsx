import { FC, useCallback } from "react";
import { DataListAuthorityFluentUI } from "../../components/DataList/DataListAuthorityFluentUi";
import { CommandBarButton, IButtonStyles, IOverflowSetItemProps, IconButton, Link, OverflowSet, Stack } from "@fluentui/react";

const noOp = () => undefined;

const buttonStyles: Partial<IButtonStyles> = {
root: {
    minWidth: 0,
    padding: '10px',
    alignSelf: 'stretch',
    height: 'auto',
},
};

export const MasterBackEnd: FC = () => {

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

    return (
        <Stack grow verticalFill>
            <Stack.Item style={{marginTop: -2, marginBottom: 4, borderBottom: '1px solid #e5e5e5'}}>
                <OverflowSet
                    aria-label="Custom Example"
                    items={[
                    {
                        key: 'authority',
                        name: 'Authority',
                        icon: 'AuthenticatorApp',
                        onClick: noOp,
                    },
                    {
                        key: 'identity',
                        name: 'Identitas',
                        icon: 'Album',
                        onClick: noOp,
                    },
                    ]}
                    onRenderItem={onRenderItem}
                    onRenderOverflowButton={onRenderOverflowButton}
                />
            </Stack.Item>
            <Stack.Item grow>
                <DataListAuthorityFluentUI
                    title="Authority"
                    initSelectedFilters={
                        {
                            pageNumber: 1,
                            pageSize: 50,
                            filters: [
                                // {
                                //     fieldName: 'posisi_tahap_pemberkasan_penerima',
                                //     value: '2'
                                // }
                            ],
                            sortOrders: [
                                {
                                    fieldName: 'tanggal',
                                    value: 'DESC'
                                },
                            ],
                        }
                    }
                /> 
            </Stack.Item>
        </Stack>
        
    )
}