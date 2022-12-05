import { IIconProps } from "@fluentui/react";

export const durationAnimFormLogin: number = 0.5;

export interface ISlideSubFormLoginParam {  
    motionKey: string;  
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISubFormLoginProps {
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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

export const variantsPassword = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            durationAnimFormLogin
        },
    },
    closed: { 
        opacity: 0, 
        x: "15%", 
        transition: {
            durationAnimFormLogin
        },
    },
};

export const contactIcon: IIconProps = { iconName: 'Contact' };
export const addFriendIcon: IIconProps = { iconName: 'AddFriend' };
export const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
    }
};
export const settingIcon: IIconProps = { iconName: 'PlayerSettings' };