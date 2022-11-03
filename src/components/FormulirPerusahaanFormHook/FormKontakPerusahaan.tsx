import { IconButton, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { SubmitHandler, useWatch } from "react-hook-form";
import { useAddPerusahaanMutation } from "../../features/perusahaan/perusahaan-api-slice";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";


interface IFormKOntakPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: any;
}
export const FormKontakPerusahaan: FC<IFormKOntakPerusahaanProps> = ({control, setMotionKey, handleSubmit}) => {
    //hook variable from react form hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });
    //local state
    const [animKontakPerusahaan, setAnimKontakPerusahaan] = useState<string>('open');

    //rtk query mutation addPerusahaan variable
    const [addPerusahaan, { data: simpleResponseAddRegister, isLoading: isLoadingAddPerusahaan }] = useAddPerusahaanMutation();

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
    const successfulCallBack: SubmitHandler<IPerusahaan> = useCallback(
        async(data) => {
            try {
                // props.setIsLoading(true);  
                // setNik(data.nik!);       
                await addPerusahaan(data).unwrap();
                // setUploadStatus(true);
                // props.setIsLoading(false);   
            } catch (error) {
                // props.setIsLoading(false);
                // props.setIsErrorConnection(true);
            }
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
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left'}}}>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Email"
                        name="kontak.email"
                        rules={{ required: "email perusahaan harus diisi" }} 
                        required
                        control={control}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Telepone"
                        name="kontak.telepone"
                        rules={{ required: "Telepone perusahaan harus diisi" }} 
                        required
                        control={control}
                        disabled={kontak.email == '' ? true:false}
                    />
                </Stack.Item>
                <Stack.Item>
                    <ControlledFluentUiTextField
                        label="Fax"
                        name="kontak.fax"
                        control={control}
                        disabled={kontak.telepone == '' ? true:false}
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    style={{marginTop: 24, width: 100}}
                    onClick={handleSubmit(successfulCallBack)}
                    disabled={kontak.telepone == '' ? true:false}
                />
            </Stack>
        </motion.div>
    );
};