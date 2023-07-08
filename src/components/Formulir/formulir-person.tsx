import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { HakAksesSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IHakAkses } from "../../features/entity/hak-akses";
import { useDeleteMutation, useSaveMutation, useUpdateMutation } from "../../features/repository/service/hak-akses-api-slice";
import { IPerson } from "../../features/entity/person";
import { useGetDaftarDataQuery as getDaftarJenisKelamin } from "../../features/repository/service/jenis-kelamin-api-slice";

interface IFormulirPersonFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IPerson;
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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 160 } };

export const FormulirPerson: FC<IFormulirPersonFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  // local state
  const [nikTextFieldValue, setNikTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nik!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
  const [selectedKeyJenisKelamin, setSelectedKeyJenisKelamin] = useState<string|undefined>(dataLama != undefined ? dataLama.jenisKelamin?.id!:undefined);
  const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined>(dataLama != undefined ? dataLama.alamat?.propinsi?.id!:undefined);
  const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined>(dataLama != undefined ? dataLama.alamat?.kabupaten?.id!:undefined);
  const [selectedKeyKecamatan, setSelectedKeyKecamatan] = useState<string|undefined>(dataLama != undefined ? dataLama.alamat?.kecamatan?.id!:undefined);
  const [selectedKeyDesa, setSelectedKeyDesa] = useState<string|undefined>(dataLama != undefined ? dataLama.alamat?.desa?.id!:undefined);
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //hook-form
  const {handleSubmit, control, resetField, watch} = useForm<IPerson>({
    defaultValues:  cloneDeep(dataLama),
    resolver: zodResolver(HakAksesSchema),
  });
  // rtk query
  const { data: postsJenisKelamin, isLoading: isLoadingJenisKelamin } = getDaftarJenisKelamin({
    pageNumber: 1,
    pageSize: 5,
    filters: [],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });  
  const [ saveHakAkses, {isLoading: isLoadingSaveHakAkses}] = useSaveMutation();
  const [ updateHakAkses, {isLoading: isLoadingUpdateHakAkses}] = useUpdateMutation();
  const [ deleteHakAkses, {isLoading: isLoadingDeleteHakAkses}] = useDeleteMutation();

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

  const optionsJenisKelamin: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsJenisKelamin?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsJenisKelamin]
  );
  
  const onSubmit: SubmitHandler<IPerson> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await saveHakAkses(data as IPerson).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
        //   await updateHakAkses({
        //     id: dataLama?.id, 
        //     nama: namaTextFieldValue,
        //     keterangan: keteranganTextFieldValue
        //   }).unwrap().then((originalPromiseResult) => {
        //     setDisableForm(false);
        //   }).catch((rejectedValueOrSerializedError) => {
        //     setDisableForm(false);
        //   }); 
        //   hideModal();
          break;
        case 'delete':
        //   await deleteHakAkses(dataLama?.id!).unwrap().then((originalPromiseResult) => {
        //     setDisableForm(false);
        //   }).catch((rejectedValueOrSerializedError) => {
        //     setDisableForm(false);
        //   }); 
        //   hideModal();
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
        <Controller 
            name="nik"
            control={control}
            render={
              ({
                field: {onChange, onBlur}, 
                fieldState: { error }
              }) => (
                  <TextField
                    label="Nik"
                    value={nikTextFieldValue}
                    onChange={
                      (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                        onChange(newValue || '');
                        setNikTextFieldValue(newValue || '');
                      }
                    }
                    styles={textFieldStyles}
                    disabled={mode == 'delete' ? true:disableForm}
                    errorMessage={error && 'harus diisi'}
                  />
              )}
        />
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
          name="jenisKelamin"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <ComboBox
                  label="Jenis kelamin"
                  placeholder="Pilih"
                  allowFreeform={true}
                  options={optionsJenisKelamin != undefined ? optionsJenisKelamin:[]}
                  selectedKey={selectedKeyJenisKelamin}
                  useComboBoxAsMenuWidth={true} 
                  styles={basicStyles}           
                  errorMessage={error && 'harus diisi'}
                  onChange={
                    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                      let hasil = cloneDeep(postsJenisKelamin?.at(index!));
                      onChange(hasil);
                      setSelectedKeyJenisKelamin(option?.key as string);
                    }
                  }
                  disabled={mode == 'delete' ? true:disableForm}
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