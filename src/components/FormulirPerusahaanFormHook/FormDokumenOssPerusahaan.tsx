import { DayOfWeek, Dropdown, IconButton, IDropdownOption, Label, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { DayPickerIndonesiaStrings, onFormatDate } from "../../features/config/config";
// import { useGetAllDokumenQuery } from "../../features/dokumen/dokumen-api-slice";
import { IDokumen } from "../../features/dokumen/dokumen-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { useUpdateRegisterPerusahaanMutation } from "../../features/perusahaan/register-perusahaan-api-slice";
import { ControlledFluentUiDatePicker } from "../ControlledDatePicker/ControlledFluentUiDatePicker";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

interface IFormDokumenOssPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: any;
    setError: UseFormSetError<IPerusahaan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
type daftarOptionMasterDokumen = IDropdownOption<any>[];

export const FormDokumenOssPerusahaan: FC<IFormDokumenOssPerusahaanProps> = ({control, setMotionKey, setIsLoading, setError}) => {
    //react-form-hook perusahaan
    const [id, nama, pelakuUsaha, daftarRegisterDokumen] = useWatch({
        control: control, 
        name: ['id', 'nama', 'pelakuUsaha', 'daftarRegisterDokumen']
    });
    //local state
    const [animDokumenOssPerusahaan, setAnimDokumenOssPerusahaan] = useState<string>('open');     
    const [dokumenOss, setDokumenOSS] = useState<IDokumen>(
        daftarRegisterDokumen != null ? 
        find(daftarRegisterDokumen, (item) => (item.id == '010301')) as IDokumen :
        {
            id: null,
            nama: null,
            kategoriDokumen: null,
            detailAttributeDokumen: null
        }
    );
    console.log(dokumenOss);
    //rtk query modelperizinan variable hook
    const { data: daftarMasterDokumen, isFetching: isFetchingMasterDokumen } = useGetAllDokumenQuery();    
    const [updateRegisterPerusahaan] = useUpdateRegisterPerusahaanMutation();
    
    const options: daftarOptionMasterDokumen = useMemo(
        () => {            
            if(daftarMasterDokumen != undefined) { 
                if(dokumenOss.id == null) {
                    let tmp = find(daftarMasterDokumen, (item) => (item.id == '010301')) as IDokumen;
                    setDokumenOSS({...tmp});
                }

                return [
                    ...daftarMasterDokumen.map(
                        (t) => ({
                            key: t.id!,
                            text: t.nama!
                        })
                    )
                ];
            }
            else {
                return [];
            }
        },
        [daftarMasterDokumen]
    );
    
    const handleOnChangeNib = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if (newValue != '') {
                if(dokumenOss.detailAttributeDokumen == null) {
                    dokumenOss.detailAttributeDokumen ={
                        nib: newValue
                    }
                }
                else {
                    setDokumenOSS((prev) => ({
                        ...prev, 
                        detailAttributeDokumennib: {...prev.detailAttributeDokumen, nib: newValue}
                    }));
                }                
            }
        },
        [],
    );
    
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimDokumenOssPerusahaan('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('kontakPerusahaan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );
    
    return(
        <motion.div
            animate={animDokumenOssPerusahaan}
            variants={variantAnimPerusahaan}
            className={contentStyles.body} 
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, alignItems: 'center'}}}>                    
                <IconButton 
                    iconProps={backIcon} 
                    title="Back" 
                    ariaLabel="Back"
                    onClick={processBackToPreviousStep} 
                    styles={{
                        root: {
                            borderStyle: 'none',
                            borderRadius: '50%',
                            padding: 0,
                            marginTop: 2,
                        }
                    }}/>
                <Label styles={labelTitleBack}>
                    {
                        `${pelakuUsaha.singkatan}. ${nama}`
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Dokumen OSS Perusahaan</Label>
                <Label styles={subLabelStyle}>Kami membutuhkan bukti kepemilikan dokumen OSS.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <Dropdown
                        label="Jenis Dokumen"
                        placeholder="Pilih jenis dokumen"
                        options={options}
                        defaultSelectedKey='010301'
                        disabled={true}
                    />
                </Stack.Item>
                <Stack.Item>
                    <TextField
                        label="NIB"
                        name="nib"
                        required
                        defaultValue={dokumenOss.detailAttributeDokumen != null ? dokumenOss.detailAttributeDokumen.nib : ''}
                        onChange={handleOnChangeNib}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiDatePicker
                        name='tanggalTerbit'
                        isRequired
                        label="Tanggal Penerbitan Dokumen OSS"
                        firstDayOfWeek={DayOfWeek.Sunday}
                        placeholder='Pilih tanggal penerbitan OSS'
                        ariaLabel="Pilih tanggal penerbitan"
                        strings={DayPickerIndonesiaStrings}
                        formatDate={onFormatDate}
                        control={control}
                    />
                </Stack.Item>
                <Stack.Item>
                    
                </Stack.Item>
            </Stack>
        </motion.div>
    );
}