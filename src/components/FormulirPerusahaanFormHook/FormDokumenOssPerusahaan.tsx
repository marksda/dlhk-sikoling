import { Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, stackTokens, variantAnimPerusahaan } from "./InterfacesPerusahaan";

export const FormDokumenOssPerusahaan: FC<ISubFormPerusahaanProps> = ({control, setMotionKey}) => {
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
                        skalaUsaha != null ? `Npwp - ${id}`:null
                    }
                </Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Identitas Perusahaan</Label>
                <Label styles={subLabelStyle}>Lengkapi identitas perusahaan sesuai dengan dokumen legalitas pendirian.</Label>
            </Stack>
        </motion.div>
    );
}