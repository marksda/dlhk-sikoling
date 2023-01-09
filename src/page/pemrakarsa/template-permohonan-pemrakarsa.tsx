import { FC, useMemo } from "react";
import {CommandBar, IStackStyles, Stack } from "@fluentui/react";
import { DataListPermohonanFluentUI } from "../../components/DataList/permohonan/DataListPermohonanFluentUi";
import { ModalFormulirAddSuratArahan } from "../../components/Modal/ModalFormulirAddSuratArahan";
import { useBoolean } from "@fluentui/react-hooks";
import { useGetAllRegisterPermohonanQuery } from "../../features/permohonan/register-permohonan-api-slice";
import omit from "lodash.omit";
import { IListItemRegisterPermohonan } from "../../components/DataList/permohonan/InterfaceDataListPermohonan";

const kontenStyles: IStackStyles = {
    root: {
        padding: 0,     
        background: 'white'
    },
};

type daftarItemRegisterPermohonan = IListItemRegisterPermohonan[];

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
    const [isModalAddPermohonanSuratArahanOpen, { setTrue: showModalAddPermohonanSuratArahan, setFalse: hideModalAddPermohonanSuratArahan }] = useBoolean(false);
    const [isModalAddPermohonanSPPLOpen, { setTrue: showModalAddPermohonanSPPL, setFalse: hideModalAddPermohonanSPPL }] = useBoolean(false);
    //rtk query permohonan variable hook
    const {data: daftarRegisterPermohonan, error, isFetching, isError} = useGetAllRegisterPermohonanQuery();


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
                            onClick: showModalAddPermohonanSuratArahan
                        },
                        {
                            key: 'dokumenSPPL',
                            text: 'Dokumen SPPL',
                            iconProps: {iconName: 'issueTracking'},
                            onClick: showModalAddPermohonanSPPL
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

    const dataRegisterPermohonan: daftarItemRegisterPermohonan = useMemo(
        () => {
            if(daftarRegisterPermohonan != undefined) {
                return [
                    ...daftarRegisterPermohonan.map(
                        (t) => (
                            {key: t.id as string, ...omit(t, ['id'])}
                        )
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarRegisterPermohonan]
    );

    console.log(dataRegisterPermohonan);
       
    return (
        <>
        <Stack styles={kontenStyles}>
            <Stack.Item>
                <CommandBar
                    items={_items}
                />
            </Stack.Item>
            <Stack.Item>
                <DataListPermohonanFluentUI dataPermohonan={dataRegisterPermohonan}/>
            </Stack.Item>
        </Stack>
        <ModalFormulirAddSuratArahan
            isModalOpen={isModalAddPermohonanSuratArahanOpen}
            hideModal={hideModalAddPermohonanSuratArahan}
            isDraggable={true}
        />
        </>
    );
}