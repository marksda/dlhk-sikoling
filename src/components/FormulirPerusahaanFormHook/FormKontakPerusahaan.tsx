import { IconButton, Label, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { useWatch } from "react-hook-form";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormKontakPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setValue, setMotionKey}) => {
    //hook variable from react form hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });
    //local state
    const [animKontakPerusahaan, setAnimKontakPerusahaan] = useState<string>('open');

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimKontakPerusahaan('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('alamatPerusahaan');
                },
                duration*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    return (
        <motion.div
            animate={animKontakPerusahaan}
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
                <Label styles={labelTitleBack}>Alamat perusahaan</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Kontak Perusahaan</Label>
                <Label styles={subLabelStyle}>Lengkapi kontak perusahaan sesuai dengan dokumen legalitas pendirian.</Label>
            </Stack>
            
        </motion.div>
    );
};