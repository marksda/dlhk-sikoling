import { DefaultEffects, Stack } from "@fluentui/react";
import { FC } from "react";
import { FormulirPemrakarsa } from "../../components/FormulirPemrakarsa/FormulirPemrakarsa";

const kontenStyles: React.CSSProperties = {    
    // boxShadow: DefaultEffects.elevation4, 
    border: '1px solid #C7C4C4',
    marginLeft: 4,
    height: 'calc(100vh - 124px)',
};

export const PermohonanArahan: FC = () => {
    return(
        <Stack.Item grow style={kontenStyles}>
            <FormulirPemrakarsa />
        </Stack.Item>
    )
};