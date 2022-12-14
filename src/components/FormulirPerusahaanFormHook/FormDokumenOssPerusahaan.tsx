import { Dropdown, IconButton, IDropdownOption, Label, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import find from "lodash.find";
import { FC, useCallback, useMemo, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { useGetAllDokumenQuery } from "../../features/dokumen/dokumen-api-slice";
import { IRegisterDokumen } from "../../features/dokumen/register-dokumen-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
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
    // const [itemRegisterDokumenOSS, setItemRegisterDokumenOSS] = useState<IRegisterDokumen|null>(null);
    //rtk query modelperizinan variable hook
    const { data: daftarMasterDokumen, isFetching: isFetchingMasterDokumen } = useGetAllDokumenQuery();    
    
    const options: daftarOptionMasterDokumen = useMemo(
        () => {
            if(daftarMasterDokumen != undefined) {                
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

    // const itemRegisterDokumenOSS: IRegisterDokumen|null = useMemo(
    //     () => {
    //         let item = null;
    //         item = find(daftarRegisterDokumen, (i) => {i.dokumen.kategoriDokumen.id == '010301'});
    //         if(item != null) {

    //         }
    //         return item;
    //     },
    //     [daftarMasterDokumen]
    // );

    // const itemRegisterDokumenOss: IRegisterDokumen =
    

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
                <Label styles={subLabelStyle}>Isi dan Upload file dokumen OSS sebagai bukti sudah memiliki.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <Dropdown
                        label="Jenis Dokumen"
                        placeholder="Pilih jenis dokumen"
                        options={options}
                        defaultSelectedKey='010301'
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="NIB"
                        name="kontak.email"
                        rules={{ required: "email perusahaan harus diisi" }} 
                        required
                        control={control}
                    />
                </Stack.Item>
            </Stack>
        </motion.div>
    );
}