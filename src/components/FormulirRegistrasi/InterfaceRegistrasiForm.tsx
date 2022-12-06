import { IIconProps } from "@fluentui/react";
import { Control, UseFormHandleSubmit, UseFormSetValue } from "react-hook-form";
import { IPerson } from "../../features/person/person-slice";

export const durationAnimFormRegistrasi: number = 0.5;

export interface ISlideSubFormRegistrasiParam {  
    motionKey: string;  
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    changeHightContainer: React.Dispatch<React.SetStateAction<number>>;
    setIsErrorConnection: React.Dispatch<React.SetStateAction<boolean>>;
    setValue: UseFormSetValue<IPerson>;
    control: Control<any>;
    handleSubmit: UseFormHandleSubmit<IPerson>;
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
export const variantPID = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            durationAnimFormRegistrasi
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            durationAnimFormRegistrasi
        },
    },
};
export const variantPID2 = {
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
export const variantUploadKTP = {
    open: {       
        opacity: 1, 
        x: 0,
        transition: {
            durationAnimFormRegistrasi
        },
    },
    closed: { 
        opacity: 0, 
        x: "-10%", 
        transition: {
            durationAnimFormRegistrasi
        },
    },
};

export const contactIcon: IIconProps = { iconName: 'Contact' };
export const unlockIcon: IIconProps = { iconName: 'Unlock' };
export const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
    }
};