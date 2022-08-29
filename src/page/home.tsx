import { DefaultPalette, Image, IStackItemStyles, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import { FormulirLogin } from "../components/FormulirLogin/FormulirLogin";
import logo from '../sidoarjo.svg';


const containerStackTokens: IStackTokens = { childrenGap: 5};
const headerStackTokens: IStackTokens = { childrenGap: 16};
const containerBodyStackTokens: IStackTokens = { childrenGap: 5};
const stackStyles: IStackStyles = {
    root: {
      background: '#3c8dbc',
      paddingLeft: 52,
      paddingRight: 52,
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
const stackBodyStyles: IStackStyles = {
    root: {
      paddingLeft: 16,
      paddingRight: 16,
    },
};

export const Home: FC = () => {
    const today = new Date().toLocaleDateString();
    return (
        <Stack tokens={containerStackTokens} >
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
            <Stack horizontal reversed tokens={containerBodyStackTokens} styles={stackBodyStyles}>
                <FormulirLogin />
            </Stack>             
        </Stack>
    );
}