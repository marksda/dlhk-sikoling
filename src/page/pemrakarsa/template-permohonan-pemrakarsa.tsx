import React, { FC, useCallback, useMemo, useState } from "react";
import {CommandBar, ICommandBarItemProps, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { DataListPermohonanFluentUI } from "../../components/DataList/DataListPermohonanFluentUi";
import { ModalFormulirAddSuratArahan } from "../../components/Modal/ModalFormulirAddSuratArahan";
import { useBoolean } from "@fluentui/react-hooks";

const kontenStyles: IStackStyles = {
    root: {
        padding: 0,     
        background: 'white'
    },
};

// const _items: ICommandBarItemProps[] = [
//     {
//         key: 'buatPengajuanItem',
//         text: 'Buat pengajuan',
//         iconProps: {iconName: 'add'},
//         subMenuProps: {
//             items: [
//                 {
//                     key: 'suratArahan',
//                     text: 'Surat arahan',
//                     iconProps: {iconName: 'issueTracking'},
//                     onClick: () => alert('asu')
//                 },
//                 {
//                     key: 'dokumenSPPL',
//                     text: 'Dokumen SPPL',
//                     iconProps: {iconName: 'issueTracking'},
//                 },
//                 {
//                     key: 'dokumenUKLUPL',
//                     text: 'Dokumen UKL-UPL',
//                     iconProps: {iconName: 'issueTracking'},
//                 },
//                 {
//                     key: 'pertekBMAL',
//                     text: 'Pertek BMAL',
//                     iconProps: {iconName: 'issueTracking'},
//                 },
//                 {
//                     key: 'pertekLimbah B3',
//                     text: 'Pertek Limbah B3',
//                     iconProps: {iconName: 'issueTracking'},
//                 },
//             ]
//         },
//     }
// ];
export const KontenPermohonanPemrakarsa: FC = () => {
    // local state
    const [isModalAddSuratArahanOpen, { setTrue: showModalAddSuratArahan, setFalse: hideModalAddModalSuratArahan }] = useBoolean(false);


    const _items = useMemo(
        () => {
            return [{
                key: 'buatPengajuanItem',
                text: 'Buat pengajuan',
                iconProps: {iconName: 'add'},
                subMenuProps: {
                    items: [
                        {
                            key: 'suratArahan',
                            text: 'Surat arahan',
                            iconProps: {iconName: 'issueTracking'},
                            onClick: showModalAddSuratArahan
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
            }]
        },
        []
    );
       
    return (
        <>
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
        <ModalFormulirAddSuratArahan
            isModalOpen={isModalAddSuratArahanOpen}
            hideModal={hideModalAddModalSuratArahan}
            isDraggable={true}
        />
        </>
    );
}