import { IconButton, ILabelStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPasswordCredential } from "../../features/security/authentication-slice";
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
};

export const SubFormPasswordRegistrasi: FC<ISubFormPasswordRegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue, control}) => {
    //hook variable from react form hook
    const [kontak] = useWatch({
        control: control, 
        name: ['kontak']
    });

    //hook redux variable
    const authentication = useAppSelector(state => state.credential);

    // local state
    const [animPassword, setAnimPassword] = useState<string>('open');
    const [password, setPassword] = useState<string>(authentication.password);
    const [errorPassword, setErrorPassword] = useState<string>('');

    //redux action creator
    const dispatch = useAppDispatch();

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

    //this function is used to track userName changes
    const processPasswordChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorPassword.length != 0) {                
                setErrorPassword('');
            }

            setPassword(newValue||'');
        },
        [],
    );

    //this function is used to process next step (FormPersonIdentityStepOne) with dependen on userName changes only
    const processNextStep = useCallback(
        () => {
            let test = password.length > 7 ? true:false;
            if(test == true) {
                if(errorPassword.length > 0) {
                    setErrorPassword('');
                }

                dispatch(setPasswordCredential(password));       
                setAnimPassword('closed');

                let timer = setTimeout(
                    () => {
                        changeHightContainer(570);
                        setMotionKey('pid');
                    },
                    durationAnimFormRegistrasi*1000
                );
                return () => clearTimeout(timer);
            }
            else {
                setErrorPassword("panjang sandi minimal 8 karakter");
            }
        },
        [password]
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
            <TextField 
                placeholder="kata sandi"
                value={password}
                onChange={processPasswordChange}
                onKeyUp={
                    (event) => {
                        if(event.key == 'Enter') {
                            processNextStep();
                        }
                    }
                }
                underlined 
                type="password"
                disabled={false}
                errorMessage={errorPassword}                    
                styles={{root: {marginBottom: 8}}}
            />
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Lanjut" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    disabled={false}
                    />
            </Stack>
        </motion.div>
    );
}