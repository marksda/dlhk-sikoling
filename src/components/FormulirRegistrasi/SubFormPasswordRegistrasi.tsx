import { IconButton, ILabelStyles, Label, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { backIcon } from "../FormulirLogin/InterfaceLoginForm";
import { durationAnimFormRegistrasi, ISubFormRegistrasiProps, variantPassword } from "./InterfaceRegistrasiForm";

const stackTokens = { childrenGap: 2 };
const labelUserNameStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const labelSandiStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       color: '#383838',
       fontSize: '1rem', 
    }
};

interface ISubFormPasswordRegistrasiProps extends ISubFormRegistrasiProps {
    control?: Control<any>;
}

export const SubFormPasswordRegistrasi: FC<ISubFormPasswordRegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control}) => {
    //hook variable from react form hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });

    // local state
    const [animPassword, setAnimPassword] = useState<string>('open');

    //this function is used to go back to FormEmail
    const processBackToPreviousStep = useCallback(
        () => {
            setAnimPassword('closed');

            let timer = setTimeout(
                () => {
                    changeHightContainer(300);
                    setMotionKey('email');
                },
                durationAnimFormRegistrasi*1000
            );

            return () => clearTimeout(timer);
        },
        []
    );

    //rendered function
    return(
        <motion.div
            animate={animPassword}
            variants={variantPassword}
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
                <Label styles={labelUserNameStyle}>{kontak.email}</Label>
            </Stack>
            <Stack tokens={stackTokens} styles={{root: { width: 400, alignItems: 'left', marginBottom: 16}}}>
                <Label styles={labelStyle}>Buat kata sandi</Label>
                <Label styles={labelSandiStyle}>Masukkan kata sandi yang ingin digunakan.</Label>
            </Stack>

        </motion.div>
    );
}