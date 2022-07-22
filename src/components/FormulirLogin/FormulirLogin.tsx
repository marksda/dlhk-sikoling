import { IIconProps, ILabelStyles, IStackProps, Label, Stack, TextField } from "@fluentui/react";
import { FC } from "react";
import logo from '../../logo.svg';


const columnProps: Partial<IStackProps> = {
    tokens: { childrenGap: 15 },
    styles: { root: { width: 300, marginTop: 16} },
};

const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
}

const iconProps: IIconProps = { iconName: 'Contact' }

export const FormulirLogin: FC = () => {

    return(
        <>
            <img src={logo} alt="logo" />
            <Label styles={labelStyle}>Sign in</Label>
            <Stack {...columnProps}>
            <TextField placeholder="Email" iconProps={iconProps} underlined/>
            </Stack>
        </>
    );
};