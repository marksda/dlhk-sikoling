import { ContextualMenu, IDragOptions, IIconProps, ILabelStyles, mergeStyleSets } from "@fluentui/react";
import { Control, SubmitHandler, UseFormHandleSubmit, UseFormReset, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { IPerusahaan } from "../../features/perusahaan/perusahaan-slice";


export const duration: number = 0.5;
export const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
};
/************************interface********************************/
export interface IModalFormulirPerusahaanProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};
export interface ISlideSubFormPerusahaanParam {
    motionKey: string;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    control: Control<IPerusahaan, Object>;
    setValue: UseFormSetValue<IPerusahaan>;
    reset: UseFormReset<IPerusahaan>;
    handleSubmit: UseFormHandleSubmit<IPerusahaan>;
    setError: UseFormSetError<IPerusahaan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface ISubFormPerusahaanProps {
    control?: Control<any>;
    setValue: UseFormSetValue<IPerusahaan>;
    setError?: UseFormSetError<IPerusahaan>;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
};
/***************************style**********************************/
export const stackTokens = { childrenGap: 2 };
export const contentStyles = mergeStyleSets({
    body: {
        flex: '4 4 auto',        
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        overflowX: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
    }
});
export const variantAnimPerusahaan = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            duration
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-10%', 
        transition: {
            duration
        },
    },
};
export const labelTitleBack: ILabelStyles  = {
    root: {
       fontWeight: 400,
       fontSize: '1rem', 
    }
};
export const labelStyle: ILabelStyles  = {
    root: {
       fontWeight: 600,
       color: '#1b1b1b',
       fontSize: '1.5rem', 
    }
};
export const subLabelStyle: ILabelStyles  = {
    root: {
       fontWeight: 400,
       color: '#383838',
       fontSize: '1rem', 
    }
};
export const tableIdentityPerusahaanStyles = mergeStyleSets({
    body: {
        width: '100%',
        selectors: {            
          'td:nth-child(1)': { width: 100, textAlign: 'left', padding: 4 },
          'td:nth-child(2)': { padding: 4 },
          'td:nth-child(3)': { backgroundColor: '#3CEDF7', padding: 4 },
        },
    }
});
/*******************************icon***********************************/
export const cancelIcon: IIconProps = { iconName: 'Cancel' };
export const backIcon: IIconProps = { 
    iconName: 'Back',
    style: {
        color: 'grey',
        fontSize: '0.8rem',
    }
};