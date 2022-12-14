import { IconButton, Label, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { UseFormSetError, useWatch } from "react-hook-form";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiDropDown } from "../ControlledDropDown/ControlledFluentUiDropDown";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

interface IFormDokumenOssPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: any;
    setError: UseFormSetError<IPerusahaan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormDokumenOssPerusahaan: FC<IFormDokumenOssPerusahaanProps> = ({control, setMotionKey, setIsLoading, setError}) => {
    //hook variable from react form hook
    const [id, nama, pelakuUsaha] = useWatch({
        control: control, 
        name: ['id', 'nama', 'pelakuUsaha']
    });
    //local state
    const [animDokumenOssPerusahaan, setAnimDokumenOssPerusahaan] = useState<string>('open');     

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
                <Label styles={subLabelStyle}>Upload file dokumen OSS sebagai bukti sudah memiliki.</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
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