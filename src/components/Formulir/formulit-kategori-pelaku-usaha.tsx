import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { KategoriPelakuUsahaSchema, SkalaUsahaSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useSaveSkalaUsahaMutation, useUpdateSkalaUsahaMutation, useUpdateIdSkalaUsahaMutation, useDeleteSkalaUsahaMutation, useGetDaftarDataSkalaUsahaQuery, useSaveKategoriPelakuUsahaMutation, useUpdateKategoriPelakuUsahaMutation, useUpdateIdKategoriPelakuUsahaMutation, useDeleteKategoriPelakuUsahaMutation } from "../../features/repository/service/sikoling-api-slice";
import { IModelPerizinan } from "../../features/entity/model-perizinan";
import { ISkalaUsaha } from "../../features/entity/skala-usaha";
import { IKategoriPelakuUsaha } from "../../features/entity/kategori-pelaku-usaha";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";

interface IFormulirKategoriPelakuUsahaFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IKategoriPelakuUsaha;
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
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 350 } };
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

export const FormulirKategoriPelakuUsaha: FC<IFormulirKategoriPelakuUsahaFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  // local state
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
  const [selectedKeySkalaUsaha, setSelectedKeySkalaUsaha] = useState<string|undefined|null>(dataLama != undefined ? dataLama.skalaUsaha?.id!:undefined);
  const [querySkalaUsahaParams, setQuerySkalaUsahaParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 100,
    filters: [],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //hook-form
  const {handleSubmit, control, setValue} = useForm<IKategoriPelakuUsaha>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null, nama: undefined},
    resolver: zodResolver(KategoriPelakuUsahaSchema),
  });
  // rtk query
  const { data: postsSkalaUsaha, isLoading: isLoadingPostsSkalaUsaha } = useGetDaftarDataSkalaUsahaQuery(querySkalaUsahaParams);    
  const [ saveKategoriPelakuUsaha] = useSaveKategoriPelakuUsahaMutation();
  const [ updateKategoriPelakuUsaha] = useUpdateKategoriPelakuUsahaMutation();
  const [ updateIdKategoriPelakuUsaha] = useUpdateIdKategoriPelakuUsahaMutation();
  const [ deleteKategoriPelakuUsaha] = useDeleteKategoriPelakuUsahaMutation();

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

  const optionsSkalaUsaha: IComboBoxOption[]|undefined = useMemo(
    () => (
        postsSkalaUsaha?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.singkatan!,
                data: item
              };
            })
    ),
    [postsSkalaUsaha]
  );
  
  const onSubmit: SubmitHandler<IKategoriPelakuUsaha> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await saveKategoriPelakuUsaha(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
          if(dataLama?.id == data.id) {
            await updateKategoriPelakuUsaha(data).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }
          else {
            await updateIdKategoriPelakuUsaha({idLama: dataLama?.id!, kategoriPelakuUsaha: data}).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }          
          hideModal();
          break;
        case 'delete':
          await deleteKategoriPelakuUsaha(data).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<IKategoriPelakuUsaha> = async (err) => {
    if(mode == 'delete') {
      await deleteKategoriPelakuUsaha(dataLama!).unwrap().then((originalPromiseResult) => {
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

  const _onHandleOnChangeSkalaUsaha = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let skalaUsaha = cloneDeep(postsSkalaUsaha?.at(index!));
      setValue('skalaUsaha', skalaUsaha!);
      setSelectedKeySkalaUsaha(option?.key as string);
    },
    [postsSkalaUsaha]
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
            name="skalaUsaha"
            control={control}
            render={
            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                <ComboBox
                    label="Skala usaha"
                    placeholder="Pilih"
                    allowFreeform={true}
                    options={optionsSkalaUsaha != undefined ? optionsSkalaUsaha:[]}
                    selectedKey={selectedKeySkalaUsaha}
                    useComboBoxAsMenuWidth={true}     
                    errorMessage={error && 'harus diisi'}
                    onChange={_onHandleOnChangeSkalaUsaha}
                    disabled={mode == 'delete' ? true:disableForm}
                />
            )
            }
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