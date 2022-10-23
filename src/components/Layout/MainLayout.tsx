import { IStackStyles, Stack } from "@fluentui/react";
import { FC } from "react";

interface IMainLayoutProps {
    children?: ReactNode;
};

const RootStackStyles: IStackStyles = {
    root: {
        backgroundColor: '#F6F8F9'
    },
};

export const MainLayout: FC<IMainLayoutProps> = ({children}) => {
    return (
        <Stack horizontal styles={RootStackStyles}>
            {children}
        </Stack>
    );
};