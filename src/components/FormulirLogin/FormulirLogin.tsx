import { 
    ActionButton, DefaultEffects, IconButton, IIconProps, 
    ILabelStyles, Image, Label, PrimaryButton, Stack, TextField 
} from "@fluentui/react";
import { FC, useCallback, useState } from "react";
import { motion } from "framer-motion";
import logo from '../../sidoarjo.svg';
import { useCekUserNameMutation } from "../../features/security/authorization-api-slice";


interface IAuthentication {
    userName: string;
    password: string;
};

interface IStateAnimationFramer {
    animUserName: string;
    animPassword: string;
    flipDisplay: boolean;
}

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
    const [cekUserName, { isLoading: isLoadingCekUserName }] = useCekUserNameMutation();
    
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

    const onButtonLanjutClick = async () => { 
        try {
            const hasil = await cekUserName(loginAuthentication.userName).unwrap();
            if(hasil == true) {
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
                setErrorUserName(`Akun ${loginAuthentication.userName} tidak terdaftar, silahkan gunakan akun yang sudah terdaftar.`)
            }
        }   
        catch (err) {
            console.log(err);
        }  
        
    };

    const onChangeUserPasswordValue = useCallback(
        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
            setLoginAuthentication(
                (prev) => (
                    {...prev, password: newValue!}
                )
            );
        },
        [],
    );
    
    const onButtonMasukClick = () => {         
        // setAnimPassword(animPassword=='open'?'closed':'open');
        // setTimeout(
        //     () => {
        //         setFlipDisplay(!flipDisplay);
        //         setAnimUserName(animUserName=='open'?'closed':'open'); 
        //     },
        //     duration*1000
        // );
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
        <div style={{display: "inline-block", boxShadow: DefaultEffects.elevation4, 
            borderTop: '2px solid #0078D7', borderRadius: 3, padding: 48, margin: 16}}>
            <Image
                alt='logo'
                width={42}
                height={42}
                src={logo}
                />
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
                    <ActionButton iconProps={addFriendIcon} styles={{root: {color: '#0067b8'}}}>
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
                    underlined 
                    type="password"
                    canRevealPassword
                    revealPasswordAriaLabel="Tunjukkan sandi"
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
                        />
                </Stack>
            </motion.div>
        </div>
    );

};