import { ContextualMenu, FontWeights, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { ModelPerizinanSchema, PosisiTahapPemberkasanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useSaveModelPerizinanMutation, useUpdateModelPerizinanMutation, useUpdateIdModelPerizinanMutation, useDeleteModelPerizinanMutation, useSavePosisiTahapPemberkasanMutation, useUpdatePosisiTahapPemberkasanMutation, useUpdateIdPosisiTahapPemberkasanMutation, useDeletePosisiTahapPemberkasanMutation } from "../../features/repository/service/sikoling-api-slice";
import { IModelPerizinan } from "../../features/entity/model-perizinan";
import { IPosisiTahapPemberkasan } from "../../features/entity/posisi-tahap-pemberkasan";

interface IFormulirPosisiTahapPemberkasanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IPosisiTahapPemberkasan;
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
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 300 } };
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

export const FormulirIPosisiTahapPemberkasan: FC<IFormulirPosisiTahapPemberkasanFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  // local state
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
  const [keteranganTextFieldValue, setKeteranganTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.keterangan!:'');
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //hook-form
  const {handleSubmit, control, resetField, watch} = useForm<IPosisiTahapPemberkasan>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null, nama: undefined},
    resolver: zodResolver(PosisiTahapPemberkasanSchema),
  });
  // rtk query
  const [ savePosisiTahapPemberkasan] = useSavePosisiTahapPemberkasanMutation();
  const [ updatePosisiTahapPemberkasan] = useUpdatePosisiTahapPemberkasanMutation();
  const [ updateIdPosisiTahapPemberkasan] = useUpdateIdPosisiTahapPemberkasanMutation();
  const [ deletePosisiTahapPemberkasan] = useDeletePosisiTahapPemberkasanMutation();

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
  
  const onSubmit: SubmitHandler<IPosisiTahapPemberkasan> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await savePosisiTahapPemberkasan(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
          if(dataLama?.id == data.id) {
            await updatePosisiTahapPemberkasan(data).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }
          else {
            await updateIdPosisiTahapPemberkasan({idLama: dataLama?.id!, posisiTahapPemberkasan: data}).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }          
          hideModal();
          break;
        case 'delete':
          await deletePosisiTahapPemberkasan(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        default:
          break;
      }      
    } catch (error) {
      setDisableForm(false);
    }
  };

  const onError: SubmitErrorHandler<IPosisiTahapPemberkasan> = async (err) => {
    if(mode == 'delete') {
      await deletePosisiTahapPemberkasan(dataLama!).unwrap().then((originalPromiseResult) => {
        setDisableForm(false);
      }).catch((rejectedValueOrSerializedError) => {
        setDisableForm(false);
      }); 
      hideModal();
    }
    else {
      console.log('error', err);
    }
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
        {mode != 'add' ?
          <Controller 
            name="id"
            control={control}
            render={
                ({
                field: {onChange, onBlur}, 
                fieldState: { error }
                }) => (
                    <TextField
                        label="Id"
                        value={idTextFieldValue}
                        onChange={
                            (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                            onChange(newValue || '');
                            setIdTextFieldValue(newValue || '');
                            }
                        }
                        styles={textFieldStyles}
                        disabled={mode == 'delete' ? true:disableForm}
                        errorMessage={error && 'harus diisi'}
                    />
            )}
          />:null  
        } 
        <Controller 
          name="nama"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <TextField
                  label="Nama"
                  value={namaTextFieldValue}
                  onChange={
                    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                      onChange(newValue || '');
                      setNamaTextFieldValue(newValue || '');
                    }
                  }
                  styles={textFieldStyles}
                  disabled={mode == 'delete' ? true:disableForm}
                  errorMessage={error && 'harus diisi'}
                />
            )}
        />
        <Controller 
          name="keterangan"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <TextField
                  label="Singkatan"
                  value={keteranganTextFieldValue}
                  onChange={
                    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                      onChange(newValue || '');
                      setKeteranganTextFieldValue(newValue || '');
                    }
                  }
                  styles={textFieldStyles}
                  disabled={mode == 'delete' ? true:disableForm}
                  errorMessage={error && 'harus diisi'}
                />
            )}
        />
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