import { ActionButton, IIconProps, ILabelStyles, Image, IStackProps, Label, Stack, TextField } from "@fluentui/react";
import { FC } from "react";
import logo from '../../sidoarjo.svg';


// const columnProps: Partial<IStackProps> = {
//     tokens: { childrenGap: 16 },
//     styles: { root: { width: 300} },
// };
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

// const imageProps: IImageProps = {
//     imageFit: ImageFit.contain,
//     styles: props => ({ root: { border: '1px solid ' + props.theme.palette.neutralSecondary } }),
//   };

export const FormulirLogin: FC = () => {

    return(
        <>
            <Image
                alt='logo'
                width={42}
                height={42}
                src={logo}
            />
            <Label styles={labelStyle}>Sign in</Label>
            <TextField placeholder="user name" iconProps={contactIcon} underlined styles={{root: {marginBottom: 8}}}/>   
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Tidak memiliki akun?</Label> 
                <ActionButton iconProps={addFriendIcon}>
                Buat Akun Baru
                </ActionButton>
            </Stack>                 
            <Stack horizontal tokens={stackTokens} styles={{root: { width: 300, alignItems: 'center'}}}>
                <Label styles={{root: {fontWeight: 500, color: '#656363'}}}>Lupa akun?</Label> 
                <ActionButton iconProps={settingIcon}>
                Reset Akun
                </ActionButton>
            </Stack>
        </>
    );
};