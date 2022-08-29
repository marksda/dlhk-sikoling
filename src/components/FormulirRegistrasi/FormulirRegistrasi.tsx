import { DefaultEffects, DefaultPalette, Image, IStackItemStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";
import logo from '../../sidoarjo.svg';

const containerStyles: React.CSSProperties = {
    boxShadow: DefaultEffects.elevation4,
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 48,
    width:300,
    height: 300,
    marginLeft: 'auto',
    marginRight: 'auto',
    background: 'white',
  };
const containerStackTokens: IStackTokens = { childrenGap: 5};
const labelSikolingStyles: IStackItemStyles = {
    root: {
      color: DefaultPalette.blackTranslucent40,
      fontSize: '1.2em',
      fontWeight: 600
    },
};

export const FormulirRegistrasi: FC = () => {
    return(
        <div style={containerStyles}>
            <Stack horizontal tokens={containerStackTokens}>
                <Stack.Item>
                    <Image alt='logo' width={42} height={42} src={logo} />
                </Stack.Item>
                <Stack.Item align="center" styles={labelSikolingStyles}>
                    SIKOLING   
                </Stack.Item>  
            </Stack>
        </div>
    )
}