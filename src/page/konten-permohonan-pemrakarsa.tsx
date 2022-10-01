import { FC, useState } from "react";
import { Breadcrumb, IBreadcrumbItem, Stack } from "@fluentui/react";

export const KontenPermohonanPemrakarsa: FC = () => {
    const [itemBreadcrumb, setItemBreadcrumb] = useState<IBreadcrumbItem[]>([
        {
            text: 'Permohonan', key: 'pmh', href:''
        }
    ]);

    return (
        <Stack>
            <Stack.Item align="auto">                
                <Breadcrumb
                    items={itemBreadcrumb}
                    maxDisplayedItems={3}
                    ariaLabel="Breadcrumb permohonan"
                    overflowAriaLabel="More links"
                />
            </Stack.Item>
            <Stack.Item>
                Isi utama
            </Stack.Item>
        </Stack>
    );
}