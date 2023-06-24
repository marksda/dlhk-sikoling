import { DefaultPalette, getTheme, Image, IStackItemStyles, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import logo from '../sidoarjo.svg';
import { onFormatDate } from "../features/config/config";


const theme = getTheme();
const headerStackTokens: IStackTokens = { childrenGap: 16};
const stackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        padding: '0px 8px',
    },
};
const labelStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.white,
      fontSize: '1.4em',
      fontWeight: 500
    },
};
const dateStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.white,
      fontSize: '1.0em',
    },
};

export const Header: FC = () => {
    const today = onFormatDate(new Date());
    return (
        <Stack horizontal styles={stackStyles} tokens={headerStackTokens}>
            <Stack.Item>
                <Image alt='logo' width={56} height={56} src={logo}/>
            </Stack.Item>
            <Stack.Item grow align="center" styles={labelStyles}>
                DLHK Sidoarjo    
            </Stack.Item>   
            <Stack.Item align="center" styles={dateStyles}>
                {`${today}`}
            </Stack.Item>             
        </Stack>
    );
}