import { getTheme, IStackTokens, Stack } from "@fluentui/react";
import { FC } from "react";

// const containerStyle: React.CSSProperties = {
//     width: '100vw',
//     height: '100vh',
//     background: 'RGB(204, 203, 202)'
// };

const containerStackTokens: IStackTokens = { childrenGap: 5};
const theme = getTheme();
const containerStyles: React.CSSProperties = {
    backgroundColor: theme.palette.themePrimary,
    color: theme.palette.white,
    lineHeight: '50px',
    padding: '0 20px',
};
export const AdminPage: FC = () => {
    return (        
        <Stack tokens={containerStackTokens} >
            <div style={containerStyles}>Hello world</div>
        </Stack>
    );
}