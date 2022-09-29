import { getTheme, IStackItemStyles, IStackStyles, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";

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
        backgroundColor: '#E1E3E4'
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
        height: 'calc(100vh - 50px)',
        width: '300px',
    },
};

export const AdminPage: FC = () => {
    return (        
        <Stack>
            <Stack horizontal styles={stackStyles}>
                <Stack.Item grow align="center" styles={labelStyles}>
                    Sikoling  
                </Stack.Item>  
            </Stack>
            <Stack horizontal styles={stackMainContainerStyles}>
                <Stack.Item styles={leftPanelStyles}>
                    Left menu Sikoling  
                </Stack.Item>  
                <Stack.Item>
                    <Stack>
                        <Stack.Item>
                            Breadcum
                        </Stack.Item>
                        <Stack.Item>
                            Isi utama
                        </Stack.Item>
                    </Stack>
                </Stack.Item>
            </Stack>
        </Stack>
    );
}