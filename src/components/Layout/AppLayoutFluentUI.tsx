import { Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";

interface IAppLayoutProps {
    children?: ReactNode;
};

export const AppLayoutFluentUI: FC<IAppLayoutProps> = ({children}) => {
    return (
        <Stack>
            {children}
        </Stack>
    );
};