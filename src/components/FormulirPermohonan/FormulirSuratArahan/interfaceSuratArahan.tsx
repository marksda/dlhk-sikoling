import { ContextualMenu, IDragOptions, IIconProps, ILabelStyles, mergeStyleSets } from "@fluentui/react";
import { Control, UseFormHandleSubmit, UseFormReset, UseFormSetError, UseFormSetValue } from "react-hook-form";
import { ISuratArahan } from "../../../features/dokumen/surat-arahan/surat-arahan-api-slice";


export const durationAnimFormSuratArahan: number = 0.5;
export const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
};
export interface IModalFormulirSuratArahanProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};
export interface ISlideSubFormSuratArahanParam {  
    motionKey: string;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
    control: Control<ISuratArahan, Object>;
    setValue: UseFormSetValue<ISuratArahan>;
    reset: UseFormReset<ISuratArahan>;
    handleSubmit: UseFormHandleSubmit<ISuratArahan>;
    setError: UseFormSetError<ISuratArahan>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export interface ISubFormSuratArahanProps {
    control?: Control<any>;
    setValue: UseFormSetValue<ISuratArahan>;
    setMotionKey: React.Dispatch<React.SetStateAction<string>>;
}
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
export const variantAnimSuratArahan = {
    open: { 
        opacity: 1, 
        x: 0,      
        transition: {
            duration: durationAnimFormSuratArahan
        },   
    },
    closed: { 
        opacity: 0, 
        x: '-10%', 
        transition: {
            duration: durationAnimFormSuratArahan
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
export const cancelIcon: IIconProps = { iconName: 'Cancel' };