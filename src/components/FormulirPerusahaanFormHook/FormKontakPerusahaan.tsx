import { IconButton, Label, PrimaryButton, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { SubmitHandler, UseFormSetError, useWatch } from "react-hook-form";
import { regexpEmail, regexpNomorTelepone } from "../../features/config/config";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";
import { useAddRegisterPerusahaanMutation } from "../../features/perusahaan/register-perusahaan-api-slice";
import { ControlledFluentUiTextField } from "../ControlledTextField/ControlledFluentUiTextField";
import { backIcon, contentStyles, duration, ISubFormPerusahaanProps, labelStyle, labelTitleBack, stackTokens, subLabelStyle, variantAnimPerusahaan } from "./InterfacesPerusahaan";

interface IFormKontakPerusahaanProps extends ISubFormPerusahaanProps {
    handleSubmit: any;
    setError: UseFormSetError<IPerusahaan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FormKontakPerusahaan: FC<IFormKontakPerusahaanProps> = ({control, setMotionKey, handleSubmit, setError, setIsLoading}) => {
    
    //hook variable from react form hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });
    //local state
    const [animKontakPerusahaan, setAnimKontakPerusahaan] = useState<string>('open');

    //rtk query mutation addPerusahaan variable
    const [addRegisterPerusahaan, { data: simpleResponseAddRegister, isLoading: isLoadingAddPerusahaan }] = useAddRegisterPerusahaanMutation();

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
                let isValid = true;
                if(regexpEmail.test(data!.kontak!.email!) == false) {
                    isValid = false;
                    setError("kontak.email", {
                        type: "manual",
                        message: `penulisan email tidak sesuai dengan format`
                    });
                }

                if(regexpNomorTelepone.test(data!.kontak!.telepone!) == false) {
                    isValid = false;
                    setError("kontak.telepone", {
                        type: "manual",
                        message: `penulisan nomor telepone tidak sesuai dengan format`
                    });
                } 

                if(data!.kontak!.fax! != '') {
                    if(data!.kontak!.fax! != '-') {
                        if(regexpNomorTelepone.test(data!.kontak!.fax!) == false) {
                            isValid = false;
                            setError("kontak.fax", {
                                type: "manual",
                                message: `penulisan fax tidak sesuai dengan format`
                            });
                        } 
                    }
                }

                if(isValid == true) {
                    setIsLoading(true);   
                    await addRegisterPerusahaan(data).unwrap();
                    setIsLoading(false);
                    // setAnimKontakPerusahaan('closed');
                    // let timer = setTimeout(
                    //     () => {
                    //         setMotionKey('dokumenOssPerusahaan');
                    //     },
                    //     duration*1000
                    // );
                    // return () => clearTimeout(timer);
                }         
            } catch (error) {
                setIsLoading(false);
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