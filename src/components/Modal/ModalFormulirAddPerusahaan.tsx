import { ContextualMenu, FontSizes, FontWeights, getTheme, IconButton, IDragOptions, IIconProps, mergeStyleSets, Modal } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC } from "react";

export interface IFormulirPerusahaanProps {
    isModalOpen: boolean;
    hideModal: () => void
};
const theme = getTheme();
const contentStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
        minWidth: 500
    },
    header: [
        // eslint-disable-next-line deprecation/deprecation
        theme.fonts.xLargePlus,
        {
          flex: '1 1 auto',
          borderTop: `4px solid ${theme.palette.themePrimary}`,
          color: theme.palette.neutralPrimary,
          display: 'flex',
          alignItems: 'center',
          fontWeight: FontWeights.semibold,
          fontSize: FontSizes.large,
          padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        selectors: {
          p: { margin: '14px 0' },
          'p:first-child': { marginTop: 0 },
          'p:last-child': { marginBottom: 0 },
        },
    },
});
const iconButtonStyles = {
    root: {
      color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      color: theme.palette.neutralDark,
    },
};
const dragOptions: IDragOptions = {
    moveMenuItemText: 'Move',
    closeMenuItemText: 'Close',
    menu: ContextualMenu,
    dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
};
const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const ModalFormulirAddPerusahaan: FC<IFormulirPerusahaanProps> = (props) => {    
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(true);
    const titleId = useId('Formulir Perusahaan');
    
    return (
        <Modal
            titleAriaId={titleId}
            isOpen={props.isModalOpen}
            onDismiss={props.hideModal}
            isBlocking={true}
            containerClassName={contentStyles.container}
            dragOptions={isDraggable ? dragOptions : undefined}
        >
            <div className={contentStyles.header}>
                <span id={titleId}>Formulir Tambah Perusahaan</span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close popup modal"
                    onClick={props.hideModal}
                />
            </div>
        </Modal>
    );
}