import { getTheme, IStackItemStyles, IStackStyles, Stack } from "@fluentui/react";
import { FC } from "react";

const theme = getTheme();
const RootStackStyles: IStackStyles = {
    root: {
        backgroundColor: theme.palette.themePrimary,
        color: theme.palette.white,
        lineHeight: '50px',
        padding: '0 20px',
    },
};
const labelTopBarStyles: IStackItemStyles = {
    root: {
      fontSize: '1.2em',
      fontWeight: 500
    },
};

export const TopBarLayoutFluentUI: FC = () => {
    return (
        <Stack horizontal styles={RootStackStyles}>
            <Stack.Item grow align="center" styles={labelTopBarStyles}>
                Sikoling  
            </Stack.Item>  
        </Stack>
    );
};