import { ContextualMenu, FontWeights, IComboBoxStyles, IDragOptions, IIconProps, IconButton, Modal , PrimaryButton, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { OtoritasSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IHakAkses } from "../../features/entity/hak-akses";

interface IFormulirHakAksesFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IHakAkses;
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
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
      padding: '12px 12px 14px 24px',
    },
  ],
  heading: {
    color: theme.palette.neutralPrimary,
    fontWeight: FontWeights.semibold,
    fontSize: 'inherit',
    margin: '0',
  },
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
const cancelIcon: IIconProps = { iconName: 'Cancel' };
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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 400 } };

export const FormulirHakAkses: FC<IFormulirHakAksesFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  // local state
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');

  //hook-form
  const {handleSubmit, control, resetField, watch} = useForm<IHakAkses>({
    defaultValues:  cloneDeep(dataLama),
    resolver: zodResolver(OtoritasSchema),
  });

  const dragOptions = useMemo(
    (): IDragOptions => ({
      moveMenuItemText: 'Move',
      closeMenuItemText: 'Close',
      menu: ContextualMenu,
      keepInBounds,
      dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
    }),
    [keepInBounds],
  );

  const onSubmit: SubmitHandler<IHakAkses> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          // await saveOtoritasPerusahaan(data as IHakAkses).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
          break;
        case 'edit':
          // await updateIdOtoritasPerusahaan({
          //   idLamaAutority: dataLama?.otoritas?.id!, 
          //   idLamaRegisterPerusahaan: dataLama?.registerPerusahaan?.id!, 
          //   registerOtoritasPerusahaan: data as IOtoritasPerusahaan
          // }).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
          break;
        case 'delete':
          // await deleteOtoritasPerusahaan(dataLama!).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
          break;
        default:
          break;
      }      
    } catch (error) {
      setDisableForm(false);
    }
  };

  const onError: SubmitErrorHandler<IHakAkses> = (err) => {
    console.log(err);
  };

  const _handleOnDismissed = useCallback(
    () => {
      setDisableForm(false);
    },
    []
  );

  return (
    <Modal
      titleAriaId={titleId}
      isOpen={isModalOpen}
      isModeless={false}
      containerClassName={contentStyles.container}
      dragOptions={dragOptions}
      onDismissed={_handleOnDismissed}
    >
      <div className={contentStyles.header}>
        <h2 className={contentStyles.heading} id={titleId}>
        {title}
        </h2>
        <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={hideModal}
        />
      </div>
      <div className={contentStyles.body}>
        
        <PrimaryButton 
          style={{marginTop: 16, width: '100%'}}
          text={mode == 'delete' ? 'Hapus':'Simpan'} 
          onClick={handleSubmit(onSubmit, onError)}
          disabled={disableForm}
        />
      </div>
    </Modal>
  );
}