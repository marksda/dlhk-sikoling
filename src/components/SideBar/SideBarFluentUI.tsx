import { IStackItemStyles, Stack } from "@fluentui/react";
import { FC, ReactNode } from "react";
import { LeftMenuFluentUI } from "../Menu/LeftMenuFluentUI";


interface ISideBarProps {
    children?: ReactNode;
};

const RootStackItemStyles: IStackItemStyles = {
    root: {
        height: 'calc(100vh - 68px)',
        width: 200,
        padding: 8,        
        border: '1px solid #eee',
    },
};

export const SideBarFluentUI: FC<ISideBarProps> = ({children}) => {
    console.log('samping');
    return (
        <Stack.Item styles={RootStackItemStyles}>
            {children}
        </Stack.Item>  
    );
}