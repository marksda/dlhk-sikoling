import { Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";

interface IAppLayoutProps {
    children?: ReactNode;
};

export const AppLayout: FC<IAppLayoutProps> = ({children}) => {
    return (
        <Stack>
            {children}
        </Stack>
    );
};