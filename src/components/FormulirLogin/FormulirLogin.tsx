import { ActionButton, DefaultEffects, IIconProps, ILabelStyles, Image, IStackProps, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { FC } from "react";
import logo from '../../sidoarjo.svg';


const stackTokens = { childrenGap: 2 }

const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
       marginTop: 16
    }
}

const contactIcon: IIconProps = { iconName: 'Contact' }
const addFriendIcon: IIconProps = { iconName: 'AddFriend' }
const settingIcon: IIconProps = { iconName: 'PlayerSettings' }

export const FormulirLogin: FC = () => {
    // const [ addPerson ] = useAddPersonMutation();

    const onButtonSimpanClick = () => { 
        //aksi
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
            <div className="userlogin">
            <Label styles={labelStyle}>Sign in</Label>
            <TextField placeholder="user name" iconProps={contactIcon} underlined styles={{root: {marginBottom: 8}}}/>
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Belum punya akun?</Label> 
                <ActionButton iconProps={addFriendIcon}>
                    daftar sekarang!
                </ActionButton>
            </Stack>                 
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Lupa akun?</Label> 
                <ActionButton iconProps={settingIcon}>
                Reset Akun
                </ActionButton>
            </Stack>
            <PrimaryButton 
                text="Berikutnya" 
                onClick={onButtonSimpanClick} 
                style={{marginTop: 24, width: 100, float: 'right'}}
                />
            </div>
        </div>
    );
};