import { IIconProps } from "@fluentui/react";

export interface IModalFormulirSuratArahanProps {
    isModalOpen: boolean;
    hideModal: () => void;
    isDraggable: boolean;
};

export const cancelIcon: IIconProps = { iconName: 'Cancel' };