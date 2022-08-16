import { ActionButton, DefaultEffects, IIconProps, ILabelStyles, Image, IStackProps, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import { FC, useState } from "react";
import { useCekUserNameQuery } from "../../features/security/authorization-api-slice";
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
    const [authenticationState, setAuthenticationState] = useState<string>('userName');
    const [userName, setUserName] = useState<string>('');
    const { data: isAda = [], isFetching: isFetchingDataPropinsi } = useCekUserNameQuery(userName);
    // const [ addPerson ] = useAddPersonMutation();
    console.log(isAda);

    const onButtonSimpanClick = () => { 
        setUserName('marksda');
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
            <div className="userloginx">
                <Label styles={labelStyle}>Sign in</Label>
                <TextField placeholder="user name" iconProps={contactIcon} underlined styles={{root: {marginBottom: 8, width: 300}}}/>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                    <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Belum punya akun?</Label> 
                    <ActionButton iconProps={addFriendIcon} styles={{root: {color: '#0067b8'}}}>
                        daftar sekarang!
                    </ActionButton>
                </Stack>                 
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                    <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Lupa akun?</Label> 
                    <ActionButton iconProps={settingIcon} styles={{root: {color: '#0067b8'}}}>
                        Reset Akun
                    </ActionButton>
                </Stack>
                <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, justifyContent: 'flex-end'}}}>
                    <PrimaryButton 
                        text="Berikutnya" 
                        onClick={onButtonSimpanClick} 
                        style={{marginTop: 24, width: 100}}
                        />
                </Stack>
            </div>
        </div>
    );
};