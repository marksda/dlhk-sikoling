import { DefaultEffects, DefaultPalette, Image, IStackItemStyles, IStackTokens, Stack } from "@fluentui/react";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import logo from '../../sidoarjo.svg';

const containerStyles: React.CSSProperties = {
    boxShadow: DefaultEffects.elevation4,
    borderTop: '2px solid #0078D7', 
    borderRadius: 3, 
    padding: 32,
    width:500,
    minHeight: 500,
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

interface IStateRegistrasiAnimationFramer {
    animUserName: string;
    animPassword: string;
    flipDisplay: boolean;
}

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

export const FormulirRegistrasi: FC = () => {
    const [variant, setVariant] = useState<IStateRegistrasiAnimationFramer>({
        animUserName: 'open',
        animPassword: 'closed',
        flipDisplay: true,
    });
    
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
            <div style={{height: 8}}></div>
            <motion.div
                animate={variant.animUserName}
                variants={variantsUserName}
                style={variant.flipDisplay?{display:'block'}:{display:'none'}}
            >
                
            </motion.div>
        </div>
    )
}