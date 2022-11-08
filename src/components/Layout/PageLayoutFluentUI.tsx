import { IStackItemStyles, Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";

interface IPageLayoutProps {
    children?: ReactNode;
};

const RootIStackStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 60px)',
        // padding: '0px 4px 8px 4px',   
        padding: 0,     
        backgroundColor: 'white'
    },
};

export const PageLayoutFluentUI: FC<IPageLayoutProps> = ({children}) => {
    return (
        <Stack.Item grow styles={RootIStackStyles}>
            {children}
        </Stack.Item>
    );
};