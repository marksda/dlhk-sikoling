import { ActionButton, IconButton, ILabelStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { ICredential } from "../../features/security/authentication-slice";
import { useGetTokenMutation } from "../../features/security/token-api-slice";
import { backIcon, durationAnimFormLogin, ISubFormLoginProps, settingIcon, variantsPassword } from "./InterfaceLoginForm";
import { useNavigate } from "react-router-dom";

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
    const credential = useAppSelector(state => state.credential);
    const navigate = useNavigate();
    
    //local state
    const [animPassword, setAnimPassword] = useState<string>('open');
    const [password, setPassword] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string|undefined>(undefined);

    //rtk query
    const [getToken, {isLoading: isLoadingGetToken}] = useGetTokenMutation();
    // const [getToken, { data: dataToken, isLoading: isLoadingGetToken}] = useGetTokenMutation();

    // console.log(dataToken, isLoadingGetToken);

    //redux action creator
    // const dispatch = useAppDispatch();

    //react router
    // const navigate = useNavigate();

    // useEffect(
    //     () => {
    //         if(credential.password != '') {
    //             getToken(credential);
    //         }
    //     },
    //     [credential]
    // );

    // useEffect(
    //     () => {
    //         setIsLoading(false); 
    //         if(dataToken != undefined && dataToken.status == 'oke') {
    //             localStorage.setItem('token', JSON.stringify(dataToken.token));
    //             dispatch(resetCredential());
    //             dispatch(setToken(dataToken.token));
    //             switch (dataToken.token.hakAkses) {
    //                 case 'Umum':
    //                     navigate("/pemrakarsa");
    //                     break;   
    //                 case 'admin':
    //                     navigate("/admin");
    //                     break;                
    //                 default:
    //                     break;
    //             }
    //         }
    //     },
    //     [dataToken]
    // );

    useEffect(
        () => {
            if(errorPassword != undefined && errorPassword == "") {
                navigate("/");
            }
        },
        [errorPassword]
    );

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
            setIsLoading(true);  
            // dispatch(setPasswordCredential(password));  
            let item: ICredential = {
                userName: credential.userName,
                password: password
            };

            try {
                await getToken(item).unwrap().then((originalPromiseResult) => {
                    setErrorPassword("");
                  }).catch((rejectedValueOrSerializedError) => {
                    setErrorPassword("Sandi tidak sesuai");
                  });                
            } catch (error) {
                // if (isFetchBaseQueryError(error)) {
                //     if ("message" in error.data) {
                //       setErrorMessage(error.data.message);
                //     }
                // } else if (isErrorWithMessage(error)) {
                //     setErrorMessage(error.message);
                // }
            }
            finally {
                setIsLoading(false);  
            }
            
        },
        [password, credential]
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
                <Label styles={labelUserNameStyle}>{credential.userName}</Label>
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