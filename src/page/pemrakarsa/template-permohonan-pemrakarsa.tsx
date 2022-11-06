import React, { FC, useCallback, useState } from "react";
import {CommandBar, ICommandBarItemProps, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { DataListPermohonanFluentUI } from "../../components/DataList/DataListPermohonanFluentUi";

const kontenStyles: IStackStyles = {
    root: {
        padding: 0,     
    },
};

const _items: ICommandBarItemProps[] = [
    {
        key: 'buatPengajuanItem',
        text: 'Buat pengajuan',
        iconProps: {iconName: 'add'},
        subMenuProps: {
            items: [
                {
                    key: 'suratArahan',
                    text: 'Surat arahan',
                    iconProps: {iconName: 'issueTracking'},
                },
                {
                    key: 'dokumenSPPL',
                    text: 'Dokumen SPPL',
                    iconProps: {iconName: 'issueTracking'},
                },
                {
                    key: 'dokumenUKLUPL',
                    text: 'Dokumen UKL-UPL',
                    iconProps: {iconName: 'issueTracking'},
                },
                {
                    key: 'pertekBMAL',
                    text: 'Pertek BMAL',
                    iconProps: {iconName: 'issueTracking'},
                },
                {
                    key: 'pertekLimbah B3',
                    text: 'Pertek Limbah B3',
                    iconProps: {iconName: 'issueTracking'},
                },
            ]
        },
    }
];
export const KontenPermohonanPemrakarsa: FC = () => {
       
    return (
        <Stack styles={kontenStyles}>
            <Stack.Item>
                <CommandBar
                    items={_items}
                />
            </Stack.Item>
            <Stack.Item>
                <DataListPermohonanFluentUI />
            </Stack.Item>
        </Stack>
    );
}