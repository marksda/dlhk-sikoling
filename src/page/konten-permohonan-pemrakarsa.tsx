import { FC, useState } from "react";
import { Breadcrumb, IBreadcrumbItem, IStackItemStyles, Stack } from "@fluentui/react";

const kontenStyles: IStackItemStyles = {
    root: {
        padding: '0px 8px',        
    },
};

export const KontenPermohonanPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Permohonan', key: 'pmh', href:''
        }
    ]);

    return (
        <Stack >
            <Stack.Item align="auto">                
                <Breadcrumb
                    items={itemBreadcrumb}
                    maxDisplayedItems={3}
                    ariaLabel="Breadcrumb permohonan"
                    overflowAriaLabel="More links"
                />
            </Stack.Item>
            <Stack.Item styles={kontenStyles}>
                Isi utama
            </Stack.Item>
        </Stack>
    );
}