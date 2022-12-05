import { ActionButton, ILabelStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { regexpEmail } from "../../features/config/config";
import { useCekUserNameQuery } from "../../features/security/authentication-api-slice";
import { setUserNameAuthentication } from "../../features/security/authentication-slice";
import { contactIcon, durationAnimFormRegistrasi, ISubFormRegistrasiProps, unlockIcon, variantUserName } from "./InterfaceRegistrasiForm";

const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};

export const SubFormEmailRegistrasi: FC<ISubFormRegistrasiProps> = ({setMotionKey, setIsLoading, changeHightContainer, setIsErrorConnection, setValue}) => {
    //local state
    const [rtkQueryEmailState, setRtkQueryEmailState] = useState<{userName: string; skip: boolean}>({userName: '', skip: true});
    const [animEmail, setAnimEmail] = useState<string>('open');
    const [userName, setUserName] = useState<string>('');
    const [errorUserName, setErrorUserName] = useState<string>('');

    //redux action creator
    const dispatch = useAppDispatch();
    
    //react router
    const navigate = useNavigate();
    
    //rtk query
    const { 
        data: statusUserName, 
        isLoading: isLoadingCekUserName, 
        isError: isErrorConnectionCekUserName,
    } = useCekUserNameQuery(rtkQueryEmailState.userName, {skip: rtkQueryEmailState.skip});

    //animasi transisi FormEmail to next step
    useEffect(
        () => {
            if(rtkQueryEmailState.skip === false && isLoadingCekUserName === false && 
                isErrorConnectionCekUserName === false) { // sukses ambil data
                setIsErrorConnection(false);
                if(statusUserName != undefined) {
                    setIsLoading(false);
                    if(statusUserName === false) {   //data belum terdaftar                        
                        setAnimEmail('closed');                          
                        dispatch(setUserNameAuthentication(rtkQueryEmailState.userName));                        
                        setValue("kontak.email", userName);
                        let timer = setTimeout(
                            () => {                            
                                changeHightContainer(350);                
                                setMotionKey('password');
                            },
                            durationAnimFormRegistrasi*1000
                        );
                        return () => clearTimeout(timer);
                    }
                    else {  //data sudah terdaftar
                        setErrorUserName(`Email ${userName} sudah terdaftar, silahkan gunakan email yang belum terdaftar.`);
                    }
                    
                }                    
            }
            else if(rtkQueryEmailState.skip === false && isLoadingCekUserName === false && 
                isErrorConnectionCekUserName === true) {  // gagal ambil data
                setIsLoading(false);
                setIsErrorConnection(true);
            }
        }, 
        [rtkQueryEmailState, statusUserName, isLoadingCekUserName, isErrorConnectionCekUserName]
    );
    
    //this function is used to track userName changes
    const processUserNameChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorUserName.length != 0) {                
                setErrorUserName('');
            }

            setUserName(newValue||'');
        },
        [],
    );

    //this function is used to check of existensi of userName on back end server
    const processNextStep = useCallback(
        () => {  
            if(userName.length > 0) {   //jika input userName tidak dikosongi
                if(errorUserName.length > 0) {  //reset error warning text
                    setErrorUserName('');
                }

                if(userName === rtkQueryEmailState.userName) {  //data tidak mengalami perubahan
                    setAnimEmail('closed');  
                    let timer = setTimeout(
                        () => {
                            changeHightContainer(350);    
                            setMotionKey('password');
                        },
                        durationAnimFormRegistrasi*1000
                    );
                    return () => clearTimeout(timer);
                }
                else {  //data mengalami perubahan          
                    if(regexpEmail.test(userName) == true){      //cek validasi format penulisan email 
                        if(rtkQueryEmailState.skip === true) {   //cek existensi userName di server back end   
                            setRtkQueryEmailState({userName: userName, skip: false });
                        }          
                        else {
                            setRtkQueryEmailState((prev) => ({...prev, userName: userName}));
                        }
                        setIsLoading(true);
                    }         
                    else {
                        setErrorUserName(`Email yang anda masukkan tidak sesuai dengan standar penulisan email`);
                    }
                }    
            }
            else if(errorUserName.length === 0) {
                setErrorUserName(`Email tidak boleh dikosongi`);
            }        
        },
        [userName, rtkQueryEmailState, errorUserName]
    );

    //rendered function
    return(
        <motion.div
            animate={animEmail}
            variants={variantUserName}
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center', marginBottom: 16}}}>
                <Label styles={labelStyle}>Buat akun</Label>                    
            </Stack>
            <TextField 
                placeholder="Gunakan email yang masih aktif" 
                value={userName}
                onChange={processUserNameChange}
                onKeyUp={
                    (event) => {
                        if(event.key == 'Enter') {
                            processNextStep();
                        }
                    }
                }
                iconProps={contactIcon} 
                disabled={isLoadingCekUserName}
                underlined 
                autoFocus
                errorMessage={errorUserName}
                styles={{root: {marginBottom: 8}}}
            />
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Sudah punya akun?</Label> 
                <ActionButton 
                    iconProps={unlockIcon} 
                    onClick={
                        () => {
                            navigate("/");
                        }
                    }
                    styles={{root: {color: '#0067b8'}}}
                >
                    halaman login.
                </ActionButton>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 400, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Berikutnya" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    disabled={isLoadingCekUserName}
                    />
            </Stack>
        </motion.div>
    );
}