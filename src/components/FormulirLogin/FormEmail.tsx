import { ActionButton, ILabelStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { regexpEmail } from "../../features/config/config";
import { useCekUserNameQuery } from "../../features/security/authentication-api-slice";
import { setUserNameAuthentication } from "../../features/security/authentication-slice";
import { addFriendIcon, contactIcon, durationAnimFormLogin, ISubFormLoginProps, variantsUserName } from "./InterfaceLoginForm";

const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};

export const FormEmail: FC<ISubFormLoginProps> = ({setMotionKey, setIsLoading}) => {
    //redux global state
    const authentication = useAppSelector(state => state.authentication); 

    //local state
    const [animEmail, setAnimEmail] = useState<string>('open');
    const [rtkQueryEmailState, setRtkQueryEmailState] = useState<{userName: string; skip: boolean}>({userName: '', skip: true});
    const [userName, setUserName] = useState<string>(''); 
    const [errorUserName, setErrorUserName] = useState<string>('');    

    //rtk query
    const { 
        data: statusUserName, 
        isLoading: isLoadingCekUserName, 
        isError: isErrorConnectionCekUserName,
    } = useCekUserNameQuery(rtkQueryEmailState.userName, {skip: rtkQueryEmailState.skip});
    
    //redux action creator
    const dispatch = useAppDispatch();

    //react router
    const navigate = useNavigate();

    useEffect(
        () => {
            if(rtkQueryEmailState.skip === false && isLoadingCekUserName === false && 
                isErrorConnectionCekUserName === false) { // sukses ambil data
                // props.setIsErrorConnection(false);
                if(statusUserName != undefined) {
                    setIsLoading(false);
                    if(statusUserName === false) {   //data belum terdaftar                        
                        setAnimEmail('closed');                          
                        dispatch(setUserNameAuthentication(rtkQueryEmailState.userName));

                        let timer = setTimeout(
                            () => {                            
                                setMotionKey('password');
                            },
                            durationAnimFormLogin*1000
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
                // setIsErrorConnection(true);
            }
        }, 
        [rtkQueryEmailState, statusUserName, isLoadingCekUserName, isErrorConnectionCekUserName]
    );

    const processUserNameChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUserName(newValue||'');
        },
        [],
    );

    //this function is used to process next step (FormPassword) with dependen on userName changes only
    const processNextStep = useCallback(
        () => {
            if(userName.length > 0) {
                if(errorUserName.length > 0) {  
                    setErrorUserName('');
                }

                if(userName != rtkQueryEmailState.userName) {  
                    if(regexpEmail.test(userName) == true){      
                        if(rtkQueryEmailState.skip === true) {   
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
            else {
                setErrorUserName(`Email tidak boleh dikosongi`);
            }
        },
        [userName, rtkQueryEmailState]
    );

    //rendered function
    return(
        <motion.div
            animate={animEmail}
            variants={variantsUserName}
        >
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={labelStyle}>Masuk</Label>
            </Stack>
            <TextField 
                placeholder="Email" 
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
                errorMessage={errorUserName}
                styles={{root: {marginBottom: 8, width: 300}}}/>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Belum punya akun?</Label> 
                <ActionButton 
                    iconProps={addFriendIcon} 
                    onClick={
                        () => {
                            navigate("/registrasi");
                        }
                    }
                    styles={{root: {color: '#0067b8'}}}
                >
                    daftar sekarang!
                </ActionButton>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Berikutnya" 
                    onClick={processNextStep} 
                    style={{marginTop: 24, width: 100}}
                    disabled={isLoadingCekUserName}
                    />
            </Stack>
        </motion.div>
    );

};