import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { PelakuUsahaSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useGetDaftarDataSkalaUsahaQuery, useSavePelakuUsahaMutation, useUpdatePelakuUsahaMutation, useUpdateIdPelakuUsahaMutation, useDeletePelakuUsahaMutation, useGetDaftarDataKategoriPelakuUsahaQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IPelakuUsaha } from "../../features/entity/pelaku-usaha";

interface IFormulirPelakuUsahaFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IPelakuUsaha;
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

export const FormulirPelakuUsaha: FC<IFormulirPelakuUsahaFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  // local state
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
  const [singkatanTextFieldValue, setSingkatanTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.singkatan!:'');
  const [selectedKeySkalaUsaha, setSelectedKeySkalaUsaha] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kategoriPelakuUsaha?.skalaUsaha?.id!:undefined);
  const [selectedKeyKategoriPelakuUsaha, setSelectedKeyKategoriPelakuUsaha] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kategoriPelakuUsaha?.id!:undefined);
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
  const [queryKategoriPelakuUsahaParams, setQueryKategoriPelakuUsahaParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 100,
    filters: dataLama == undefined ? []:[{
      fieldName: 'id_skala_usaha',
      value: dataLama.kategoriPelakuUsaha?.skalaUsaha?.id!
    }],
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
  const {handleSubmit, control, setValue, resetField} = useForm<IPelakuUsaha>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null},
    resolver: zodResolver(PelakuUsahaSchema),
  });
  // rtk query
  const { data: postsSkalaUsaha } = useGetDaftarDataSkalaUsahaQuery(querySkalaUsahaParams);    
  const { data: postsKategoriPelakuUsaha } = useGetDaftarDataKategoriPelakuUsahaQuery(queryKategoriPelakuUsahaParams, {skip: selectedKeySkalaUsaha == null ? true:false});
  const [ savePelakuUsaha] = useSavePelakuUsahaMutation();
  const [ updatePelakuUsaha] = useUpdatePelakuUsahaMutation();
  const [ updateIdPelakuUsaha] = useUpdateIdPelakuUsahaMutation();
  const [ deletePelakuUsaha] = useDeletePelakuUsahaMutation();

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

  const optionsKategoriPelakuUsaha: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsKategoriPelakuUsaha?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsKategoriPelakuUsaha]
  );
  
  const onSubmit: SubmitHandler<IPelakuUsaha> = async (data) => {
    console.log(data);
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await savePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
          if(dataLama?.id == data.id) {
            await updatePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }
          else {
            await updateIdPelakuUsaha({idLama: dataLama?.id!, pelakuUsaha: data}).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }          
          hideModal();
          break;
        case 'delete':
          await deletePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<IPelakuUsaha> = async (err) => {
    if(mode == 'delete') {
      await deletePelakuUsaha(dataLama!).unwrap().then((originalPromiseResult) => {
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

  const _resetKategoriPelakuUsaha = useCallback(
    () => {
      resetField("kategoriPelakuUsaha");
      setSelectedKeyKategoriPelakuUsaha(null);
    },
    []
  );

  const _onHandleOnChangeSkalaUsaha = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      _resetKategoriPelakuUsaha();
      setQueryKategoriPelakuUsahaParams(
        prev => {
            let tmp = cloneDeep(prev);
            let filters = cloneDeep(tmp.filters);
            let found = filters?.findIndex((obj) => {return obj.fieldName == 'id_skala_usaha'}) as number;     
                                                
            if(found == -1) {
                filters?.push({
                    fieldName: 'id_skala_usaha',
                    value: option?.key as string
                });
            }
            else {
                filters?.splice(found, 1, {
                    fieldName: 'id_skala_usaha',
                    value: option?.key as string
                })
            }
            
            tmp.pageNumber = 1;
            tmp.filters = filters;             
            return tmp;
        }
      );
      setSelectedKeySkalaUsaha(option?.key as string);
    },
    []
  );

  const _onHandleOnKategoriPelakuUsaha = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let hasil = cloneDeep(postsKategoriPelakuUsaha?.at(index!));
      setValue('kategoriPelakuUsaha', hasil!);     
      setSelectedKeyKategoriPelakuUsaha(option?.key as string);  
    },
    [postsKategoriPelakuUsaha]
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
          name="singkatan"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <TextField
                  label="Singkatan"
                  value={singkatanTextFieldValue}
                  onChange={
                    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                      onChange(newValue || '');
                      setSingkatanTextFieldValue(newValue || '');
                    }
                  }
                  styles={textFieldStyles}
                  disabled={mode == 'delete' ? true:disableForm}
                  errorMessage={error && 'harus diisi'}
                />
            )}
        />
        <ComboBox
            label="Skala usaha"
            placeholder="Pilih"
            allowFreeform={true}
            options={optionsSkalaUsaha != undefined ? optionsSkalaUsaha:[]}
            selectedKey={selectedKeySkalaUsaha}
            useComboBoxAsMenuWidth={true}     
            onChange={_onHandleOnChangeSkalaUsaha}
            disabled={mode == 'delete' ? true:disableForm}
        />
        <Controller 
            name="kategoriPelakuUsaha"
            control={control}
            render={
            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                <ComboBox
                  label="Kategori pelaku usaha"
                  placeholder="Pilih"
                  allowFreeform={true}
                  options={optionsKategoriPelakuUsaha != undefined ? optionsKategoriPelakuUsaha:[]}
                  selectedKey={selectedKeyKategoriPelakuUsaha}
                  useComboBoxAsMenuWidth={true}     
                  errorMessage={error && 'harus diisi'}
                  onChange={_onHandleOnKategoriPelakuUsaha}
                  disabled={mode == 'delete'||selectedKeySkalaUsaha == null ? true:disableForm}
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