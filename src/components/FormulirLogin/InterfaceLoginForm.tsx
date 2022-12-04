import { IIconProps } from "@fluentui/react";

const durationAnimFormLogin: number = 0.5;

export interface ISlideSubFormLoginParam {  
    motionKey: string;  
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISubFormLoginProps {
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
}

export const variantsUserName = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            durationAnimFormLogin
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-15%', 
        transition: {
            durationAnimFormLogin
        },
    },
};

export const contactIcon: IIconProps = { iconName: 'Contact' };
export const addFriendIcon: IIconProps = { iconName: 'AddFriend' };