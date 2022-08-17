import { ActionButton, DefaultEffects, IIconProps, ILabelStyles, Image, IStackProps, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCekUserNameQuery } from "../../features/security/authorization-api-slice";
import logo from '../../sidoarjo.svg';


const stackTokens = { childrenGap: 2 };
const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
       marginTop: 16
    }
};
const contactIcon: IIconProps = { iconName: 'Contact' };
const lockIcon: IIconProps = { iconName: 'Lock' };
const addFriendIcon: IIconProps = { iconName: 'AddFriend' };
const settingIcon: IIconProps = { iconName: 'PlayerSettings' };
const duration: number = 1;
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
    const [animUserName, setAnimUserName] = useState<string>('open');
    const [animPassword, setAnimPassword] = useState<string>('closed');
    const [flipDisplay, setFlipDisplay] = useState<boolean>(true);
    // const [userName, setUserName] = useState<string>('');
    // const { data: isAda = [], isFetching: isFetchingDataCekuserName } = useCekUserNameQuery(userName);
    // const [ addPerson ] = useAddPersonMutation();

    const onButtonLanjutClick = () => {         
        setAnimUserName(animUserName=='open'?'closed':'open'); 
        setTimeout(
            () => {
                setFlipDisplay(!flipDisplay); 
                setAnimPassword(animPassword=='open'?'closed':'open');
            },
            duration*1000
        );
    };

    const onButtonMasukClick = () => {         
        setAnimPassword(animPassword=='open'?'closed':'open');
        setTimeout(
            () => {
                setFlipDisplay(!flipDisplay);
                setAnimUserName(animUserName=='open'?'closed':'open'); 
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
            <motion.div
                animate={animUserName}
                variants={variantsUserName}
                style={flipDisplay?{display:'block'}:{display:'none'}}
            >
                <Label styles={labelStyle}>Sign in</Label>
                <TextField placeholder="user name" iconProps={contactIcon} underlined styles={{root: {marginBottom: 8, width: 300}}}/>
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
                        />
                </Stack>
            </motion.div>
            <motion.div
                animate={animPassword}
                variants={variantsPassword}
                style={!flipDisplay?{display:'block'}:{display:'none'}}
            >
                <Label styles={labelStyle}>nama</Label>
                <TextField placeholder="user name" iconProps={lockIcon} underlined styles={{root: {marginBottom: 8, width: 300}}}/>
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