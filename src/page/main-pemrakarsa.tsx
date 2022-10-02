import { getTheme, IStackItemStyles, IStackStyles, Stack } from "@fluentui/react";
import { FC } from "react";
import { KontenPermohonanPemrakarsa } from "./template-permohonan-pemrakarsa";
import { LeftMenuPage } from "./template-left-menu";

const theme = getTheme();
const stackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        lineHeight: '50px',
        padding: '0 20px',
    },
};
const stackMainContainerStyles: IStackStyles = {
    root: {
        backgroundColor: '#F6F8F9'
    },
};
const labelStyles: IStackItemStyles = {
    root: {
      fontSize: '1.2em',
      fontWeight: 500
    },
};
const leftPanelStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 68px)',
        width: 200,
        padding: 8,        
        border: '1px solid #eee',
    },
};
const rightPanelStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 60px)',
        padding: '0px 4px 8px 4px',        
    },
};

export const PemrakarsaPage: FC = () => {
    return (        
        <Stack>
            <Stack horizontal styles={stackStyles}>
                <Stack.Item grow align="center" styles={labelStyles}>
                    Sikoling  
                </Stack.Item>  
            </Stack>
            <Stack horizontal styles={stackMainContainerStyles}>
                <Stack.Item styles={leftPanelStyles}>
                    <LeftMenuPage />
                </Stack.Item>  
                <Stack.Item grow styles={rightPanelStyles}>
                    <KontenPermohonanPemrakarsa />
                </Stack.Item>
            </Stack>
        </Stack>
    );
}
