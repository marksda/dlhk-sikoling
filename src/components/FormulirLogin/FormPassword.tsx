import { IconButton, ILabelStyles, Label, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { backIcon, durationAnimFormLogin, ISubFormLoginProps, variantsPassword } from "./InterfaceLoginForm";

const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const labelUserNameStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};

export const FormPassword: FC<ISubFormLoginProps> = ({setMotionKey, setIsLoading}) => {
    //redux global state
    const authentication = useAppSelector(state => state.authentication);
    
    //local state
    const [animPassword, setAnimPassword] = useState<string>('open');
    const [password, setPassword] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    //rtk query
    const { 
        data: tokenData, 
        isLoading: isLoadingToken, 
        isError: isErrorConnectionToken,
    } = 

    const processBackToPreviousStep = useCallback(
        () => {
            setAnimPassword('closed');            
            let timer = setTimeout(
                () => {
                    setMotionKey('email');
                },
                durationAnimFormLogin*1000
            );
            return () => clearTimeout(timer);
        },
        []
    );

    const processPasswordChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setPassword(newValue||'');
        },
        [],
    );

    const onButtonMasukClick = async () => {         
        try {
            const hasil: IResponseStatusToken = await getToken(
                {
                    userName: props.userName!, 
                    password: props.password!
                }
            ).unwrap();
            
            if(hasil.status == 'oke') {
                setErrorPassword('');
                // setVariant((prev) =>({...prev, animUserName: 'closed'}));     
                // setTimeout(
                //     () => {
                //         setVariant((prev) =>({...prev, flipDisplay: !prev.flipDisplay, animPassword: 'open'}));
                //     },
                //     duration*1000
                // ); 
            }
            else if(hasil.status == 'need pid') {
                setErrorPassword(`Akun ${props.userName} tidak terdaftar, silahkan gunakan akun yang sudah terdaftar.`)
            }
            else {
                setErrorPassword(`Sandi tidak sesuai dengan akun ${props.userName}, coba gunakan sandi lain.`)
            }
        }   
        catch (err) {
            console.log(err);
        }  
    };

    return(
        <motion.div
            animate={animPassword}
            variants={variantsPassword}
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>                    
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
                <Label styles={labelUserNameStyle}>{authentication.userName}</Label>
            </Stack>                
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={labelStyle}>Masukkan sandi</Label>
            </Stack>                
            <TextField 
                placeholder="Sandi" 
                value={password}
                onChange={processPasswordChange}
                onKeyUp={
                    (event) => {
                        if(event.key == 'Enter') {
                            onButtonMasukClick();
                        }
                    }
                }
                underlined 
                type="password"
                canRevealPassword
                revealPasswordAriaLabel="Tunjukkan sandi"
                disabled={isLoadingGetToken}
                errorMessage={errorPassword}
                styles={{root: {marginBottom: 8, width: 300}}}/>
        </motion.div>
    );
}