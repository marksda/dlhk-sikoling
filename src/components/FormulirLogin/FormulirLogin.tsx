import { 
    ActionButton, DefaultEffects, DefaultPalette, IconButton, IIconProps, 
    ILabelStyles, Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, Label, PrimaryButton, ProgressIndicator, Stack, TextField 
} from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from '../../sidoarjo.svg';
import { useGetTokenMutation } from "../../features/security/authorization-api-slice";
import { IResponseStatusToken } from "../../features/security/token-slice";
import { useNavigate } from "react-router-dom";
import { HookFormEmailProps, HookFormPasswordProps } from "../../app/HookFormProps";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setUserName as setUserNameAuthentication, setPassword as setPasswordAUthentication} from "../../features/security/authentication-slice";


interface IStateAnimationFramer {
    animUserName: string;
    animPassword: string;
    flipDisplay: boolean;
};
const rootContainerStyle: React.CSSProperties = {
    display: 'table-cell',
    verticalAlign: 'middle',
};
const progressStyle: IProgressIndicatorStyles ={
    root: {
        width: 396,
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 8,
    },
    itemName: null,
    itemDescription: null,
    itemProgress: null,
    progressBar:null,
    progressTrack: null
};
const containerStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    // borderTop: '2px solid orange', 
    borderTop: '2px solid #0078D7', 
    // borderRadius: 3, 
    padding: 48,
    width:300,
    background: 'white',
};
const containerLoginStackTokens: IStackTokens = { childrenGap: 5};
const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
const labelSikolingStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.blackTranslucent40,
      fontSize: '1.2em',
      fontWeight: 600
    },
};
const labelUserNameStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
const contactIcon: IIconProps = { iconName: 'Contact' };
const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
    }
};
const addFriendIcon: IIconProps = { iconName: 'AddFriend' };
const settingIcon: IIconProps = { iconName: 'PlayerSettings' };
const duration: number = 0.5;
const variantsUserName = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            duration
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-15%', 
        transition: {
            duration
        },
    },
};
const variantsPassword = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            duration
        },
    },
    closed: { 
        opacity: 0, 
        x: "15%", 
        transition: {
            duration
        },
    },
};
const FormEmail: FC<Partial<HookFormEmailProps>> = (props) => {
    //local variable for email validation
    const regexpEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    //local state
    const [userName, setUserName] = useState<string>('');    
    const [errorUserName, setErrorUserName] = useState<string>('');
    //rtk query
    // const { data: statusUserName, isLoading: isLoadingCekUserName } = useCekUserNameQuery(props.userName!);
    // //react router
    const navigate = useNavigate();
    // //animasi transisi FormEmail to next step
    // useEffect(
    //     () => {
    //         if(statusUserName == true && props.userName!.length > 0) {
    //             if(errorUserName.length > 0) {
    //                 setErrorUserName('');
    //             }
    //             props.setIsLoading(false);                
    //             props.setVariant((prev: IStateAnimationFramer) =>({...prev, animUserName: 'closed'}));     
    //             setTimeout(
    //                 () => {
    //                     props.setVariant((prev: IStateAnimationFramer) =>({...prev, flipDisplay: !prev.flipDisplay, animPassword: 'open'}));
    //                 },
    //                 duration*1000
    //             ); 
    //         }
    //         else {
    //             if(userName.length > 0) {
    //                 setErrorUserName(`Akun ${props.userName} tidak dikenali, silahkan gunakan akun lain`);
    //             } 
    //         }
    //     }, 
    //     [props.userName]
    // );
    //this function is used to track userName changes
    const processUserNameChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setUserName(newValue||'');
        },
        [],
    );
    //this function is used to process next step (FormPassword) with dependen on userName changes only
    const processNextStep = useCallback(
        () => {
            if(regexpEmail.test(userName) == true){
                props.setIsLoading(true);
                props.dispatch(setUserNameAuthentication(userName));
            }
            else {
                setErrorUserName(`Email yang anda masukkan tidak sesuai dengan standar penulisan email`);
            }
        },
        []
    );
    //rendered function
    return(
        <motion.div
            animate={props.variant.animUserName}
            variants={variantsUserName}
            style={props.variant.flipDisplay?{display:'block'}:{display:'none'}}
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
                disabled={true && userName.length > 0}
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
                    disabled={true && userName.length > 0}
                    />
            </Stack>
        </motion.div>
    );
};
const FormPassword: FC<Partial<HookFormPasswordProps>> = (props) => {
    //local variable
    // const regexpPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    //local state
    const [password, setPassword] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    //rtk mutation getToken function variable
    const [getToken, { isLoading: isLoadingGetToken}] = useGetTokenMutation();
    //this function is used to go back to FormEmail
    const processBackToPreviousStep = useCallback(
        () => {
            props.setVariant((prev: IStateAnimationFramer) =>({...prev, animPassword: 'closed'}));

            setTimeout(
                () => {
                    props.setVariant((prev: IStateAnimationFramer) =>({...prev, flipDisplay: !prev.flipDisplay, animUserName: 'open'}));
                },
                duration*1000
            );
        },
        []
    );
    //this function is used to track userName changes
    const processPasswordChange = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            // if(newValue!.length === 0 && errorUserName.length != 0) {                
            //     setErrorPassword('');
            // }
            setPassword(newValue||'');
        },
        [],
    );
    //this function is used to process next step
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
    //rendered function
    return(
        <motion.div
            animate={props.variant.animPassword}
            variants={variantsPassword}
            style={!props.variant.flipDisplay?{display:'block'}:{display:'none'}}
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
                <Label styles={labelUserNameStyle}>{props.userName}</Label>
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
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Lupa password?</Label> 
                <ActionButton iconProps={settingIcon} styles={{root: {color: '#0067b8'}}}>
                    Reset password
                </ActionButton>
            </Stack>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, justifyContent: 'flex-end'}}}>
                <PrimaryButton 
                    text="Masuk" 
                    onClick={onButtonMasukClick} 
                    style={{marginTop: 24, width: 100}}
                    disabled={isLoadingGetToken}
                    />
            </Stack>
        </motion.div>
    );
};

export const FormulirLogin: FC = () => {
    //* local state *   
    //- digunakan untuk merubah animasi transisi setiap terjadi pergantian Form - 
    const [variant, setVariant] = useState<IStateAnimationFramer>({
        animUserName: 'open',
        animPassword: 'closed',
        flipDisplay: true,
    });
    //- digunakan untuk tracking status koneksi pemrosesan di back end
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //redux global state
    const authentication = useAppSelector(state => state.authentication);        
    //redux action creator
    const dispatch = useAppDispatch();        

    return(
        <div style={rootContainerStyle}>
            {
                isLoading && 
                (
                    <Stack>
                        <ProgressIndicator styles={progressStyle}/>
                    </Stack>
                )
            }
            <div style={containerStyles}>            
                <Stack horizontal tokens={containerLoginStackTokens}>
                    <Stack.Item>
                        <Image alt='logo' width={42} height={42} src={logo} />
                    </Stack.Item>
                    <Stack.Item align="center" styles={labelSikolingStyles}>
                        SIKOLING   
                    </Stack.Item>  
                </Stack>            
                <div style={{height: 8}}></div>
                <FormEmail
                    variant={variant} 
                    setVariant={setVariant}
                    dispatch={dispatch}
                    setIsLoading={setIsLoading}
                />
                <FormPassword
                    userName={authentication.userName}
                    password={authentication.password}              
                    variant={variant} 
                    setVariant={setVariant}
                    dispatch={dispatch}
                />                
            </div>
        </div>        
    );

};