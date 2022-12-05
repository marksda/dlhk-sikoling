import { ActionButton, IconButton, ILabelStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setPasswordAuthentication } from "../../features/security/authentication-slice";
import { useGetTokenMutation } from "../../features/security/token-api-slice";
import { setToken } from "../../features/security/token-slice";
import { backIcon, durationAnimFormLogin, ISubFormLoginProps, settingIcon, variantsPassword } from "./InterfaceLoginForm";

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
    const [getToken, {isLoading: isLoadingGetToken}] = useGetTokenMutation();
    //redux action creator
    const dispatch = useAppDispatch();

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

    const handleProcessLogin = useCallback(
        async () => {             
            try {
                const result = await getToken(authentication).unwrap;
                console.log(result);
                // dispatch(setToken(result));
                // dispatch(setPasswordAuthentication(password)); 
            } catch (error) {
                //error
            }          
        },
        [password]
    );

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
                            handleProcessLogin();
                        }
                    }
                }
                underlined 
                type="password"
                canRevealPassword
                revealPasswordAriaLabel="Tunjukkan sandi"
                disabled={isLoadingGetToken}
                errorMessage={errorPassword}
                styles={{root: {marginBottom: 8, width: 300}}}
            />
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Lupa password?</Label> 
                <ActionButton iconProps={settingIcon} styles={{root: {color: '#0067b8'}}}>
                    Reset password
                </ActionButton>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Masuk" 
                    onClick={handleProcessLogin} 
                    style={{marginTop: 24, width: 100}}
                    disabled={isLoadingGetToken}
                    />
            </Stack>
        </motion.div>
    );
}