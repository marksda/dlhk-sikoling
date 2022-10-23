import { Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";

interface IApp1Props {
    children?: ReactNode;
};

export const App1Layout: FC<IApp1Props> = ({children}) => {
    return (
        <Stack>
            {children}
        </Stack>
    );
};