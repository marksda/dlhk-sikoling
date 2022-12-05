import { IIconProps } from "@fluentui/react";
import { UseFormSetValue } from "react-hook-form";
import { IPerson } from "../../features/person/person-slice";

export const durationAnimFormRegistrasi: number = 0.5;

export interface ISlideSubFormRegistrasiParam {  
    motionKey: string;  
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    changeHightContainer: React.Dispatch<React.SetStateAction<number>>;
    setIsErrorConnection: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<IPerson>;
};

export interface ISubFormRegistrasiProps {
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    changeHightContainer: React.Dispatch<React.SetStateAction<number>>;
    setIsErrorConnection: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<IPerson>;
}

export const variantUserName = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            durationAnimFormRegistrasi
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-10%', 
        transition: {
            durationAnimFormRegistrasi
        },
    },
};
export const variantPassword = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            durationAnimFormRegistrasi
        },
    },
    closed: { 
        opacity: 0, 
        x: "10%", 
        transition: {
            durationAnimFormRegistrasi
        },
    },
};

export const contactIcon: IIconProps = { iconName: 'Contact' };
export const unlockIcon: IIconProps = { iconName: 'Unlock' };