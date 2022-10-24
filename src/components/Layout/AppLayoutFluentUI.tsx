import { IStackStyles, Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";

interface IAppLayoutProps {
    children?: ReactNode;
    styles?: IStackStyles;
};

export const AppLayoutFluentUI: FC<IAppLayoutProps> = ({children, styles}) => {
    return (
        <Stack styles={styles}>
            {children}
        </Stack>
    );
};