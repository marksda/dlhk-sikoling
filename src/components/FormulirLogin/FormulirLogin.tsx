import { 
    ActionButton, DefaultEffects, DefaultPalette, IconButton, IIconProps, 
    ILabelStyles, Image, IProgressIndicatorStyles, IStackItemStyles, IStackTokens, Label, PrimaryButton, ProgressIndicator, Stack, TextField 
} from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from '../../sidoarjo.svg';
import { useCekUserNameQuery, useGetTokenMutation } from "../../features/security/authorization-api-slice";
import { IAuthentication } from "../../features/security/authorization-slice";
import { IResponseStatusToken } from "../../features/security/token-slice";
import { useNavigate } from "react-router-dom";



interface IStateAnimationFramer {
    animUserName: string;
    animPassword: string;
    flipDisplay: boolean;
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
const containerStyles: React.CSSProperties = {    
    display: "inline-block", 
    boxShadow: DefaultEffects.elevation4, 
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 48,
    width:300,
    background: 'white',
};
const progressStyle: IProgressIndicatorStyles ={
    root: {
        width: 464,
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

export const FormulirLogin: FC = () => {
    const [userName, setUserName] = useState<string>('');
    const [variant, setVariant] = useState<IStateAnimationFramer>({
        animUserName: 'open',
        animPassword: 'closed',
        flipDisplay: true,
    });
    const [loginAuthentication, setLoginAuthentication] = useState<IAuthentication>({
        userName: '',
        password: '',
    });
    const [errorUserName, setErrorUserName] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const { data: statusUserName, isLoading: isLoadingCekUserName } = useCekUserNameQuery(userName);
    const [getToken, { isLoading: isLoadingGetToken}] = useGetTokenMutation();
    const navigate = useNavigate();

    useEffect(
        () => {
            if(statusUserName == true) {
                setErrorUserName('');
                setVariant((prev) =>({...prev, animUserName: 'closed'}));     
                setTimeout(
                    () => {
                        setVariant((prev) =>({...prev, flipDisplay: !prev.flipDisplay, animPassword: 'open'}));
                    },
                    duration*1000
                ); 
            }
            else {
                if(userName.length > 0) {
                    setErrorUserName(`Akun ${loginAuthentication.userName} tidak terdaftar, silahkan gunakan akun yang sudah terdaftar.`);
                } 
            }
        }, 
        [statusUserName]
    );
    
    const onChangeUserNameValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorUserName.length != 0) {                
                setErrorUserName('');
            }

            setLoginAuthentication(
                (prev) => (
                    {...prev, userName: newValue||''}
                )
            );
        },
        [errorUserName, setLoginAuthentication],
    );

    const onButtonLanjutClick =  useCallback(
        () => {
            setUserName(loginAuthentication.userName);
        },
        [userName]
    );
    // async () => { 
        // try {
        //     const hasil = await cekUserName(loginAuthentication.userName).unwrap();
            
            // if(hasil == true) {
            //     console.log(hasil);
            //     setErrorUserName('');
            //     setVariant((prev) =>({...prev, animUserName: 'closed'}));     
            //     setTimeout(
            //         () => {
            //             setVariant((prev) =>({...prev, flipDisplay: !prev.flipDisplay, animPassword: 'open'}));
            //         },
            //         duration*1000
            //     ); 
            // }
            // else {
            //     console.log(hasil);
            //     setErrorUserName(`Akun ${loginAuthentication.userName} tidak terdaftar, silahkan gunakan akun yang sudah terdaftar.`)
            // }
        // }   
        // catch (err) {
        //     console.log(err);
        // }          
    // };

    const onChangeUserPasswordValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            if(newValue!.length === 0 && errorUserName.length != 0) {                
                setErrorPassword('');
            }

            setLoginAuthentication(
                (prev) => (
                    {...prev, password: newValue!}
                )
            );
        },
        [],
    );
    
    const onButtonMasukClick = async () => {         
        try {
            const hasil: IResponseStatusToken = await getToken(loginAuthentication).unwrap();
            console.log(hasil);
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
                setErrorUserName(`Akun ${loginAuthentication.userName} tidak terdaftar, silahkan gunakan akun yang sudah terdaftar.`)
            }
            else {
                setErrorPassword(`Sandi tidak sesuai dengan akun ${loginAuthentication.userName}, coba gunakan sandi lain.`)
            }
        }   
        catch (err) {
            console.log(err);
        }  
    };

    const onButtonUserNameBackClick = () => {         
        setVariant((prev) =>({...prev, animPassword: 'closed'}));
        setTimeout(
            () => {
                setLoginAuthentication(
                    (prev) => (
                        {...prev, password: ''}
                    )
                );
                setVariant((prev) =>({...prev, flipDisplay: !prev.flipDisplay, animUserName: 'open'}));
            },
            duration*1000
        );
    };

    return(
        <>
            {
                (isLoadingCekUserName) &&
                (<Stack>
                    <ProgressIndicator styles={progressStyle}/>
                </Stack>)
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
                <motion.div
                    animate={variant.animUserName}
                    variants={variantsUserName}
                    style={variant.flipDisplay?{display:'block'}:{display:'none'}}
                >
                    <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                        <Label styles={labelStyle}>Masuk</Label>
                    </Stack>
                    <TextField 
                        placeholder="Email, telepon, atau nik" 
                        value={loginAuthentication.userName}
                        onChange={onChangeUserNameValue}
                        onKeyUp={
                            (event) => {
                                if(event.key == 'Enter') {
                                    onButtonLanjutClick();
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
                            onClick={onButtonLanjutClick} 
                            style={{marginTop: 24, width: 100}}
                            disabled={isLoadingCekUserName}
                            />
                    </Stack>
                </motion.div>
                <motion.div
                    animate={variant.animPassword}
                    variants={variantsPassword}
                    style={!variant.flipDisplay?{display:'block'}:{display:'none'}}
                >
                    <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>                    
                        <IconButton 
                            iconProps={backIcon} 
                            title="Back" 
                            ariaLabel="Back"
                            onClick={onButtonUserNameBackClick} 
                            styles={{
                                root: {
                                    borderStyle: 'none',
                                    borderRadius: '50%',
                                    padding: 0,
                                    marginTop: 2,
                                }
                            }}/>
                        <Label styles={labelUserNameStyle}>{loginAuthentication.userName}</Label>
                    </Stack>                
                    <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                        <Label styles={labelStyle}>Masukkan sandi</Label>
                    </Stack>                
                    <TextField 
                        placeholder="Sandi" 
                        value={loginAuthentication.password}
                        onChange={onChangeUserPasswordValue}
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
            </div>
        </>        
    );

};