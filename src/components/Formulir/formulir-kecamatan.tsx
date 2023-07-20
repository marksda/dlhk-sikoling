import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { KecamatanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IKecamatan } from "../../features/entity/kecamatan";
import { useDeleteKecamatanMutation, useSaveKecamatanMutation, useUpdateKecamatanMutation, useUpdateIdKecamatanMutation, useGetDaftarDataPropinsiQuery, useGetDaftarDataKabupatenQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";

interface IFormulirKecamatanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IKecamatan;
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

export const FormulirKecamatan: FC<IFormulirKecamatanFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  // local state
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
  const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kabupaten?.propinsi?.id!:undefined);
  const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kabupaten?.id!:undefined);
  const [queryPropinsiParams, setQueryPropinsiParams] = useState<IQueryParamFilters>({
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
  const [queryKabupatenParams, setQueryKabupatenParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 100,
    filters: dataLama == undefined ? []:[{
      fieldName: 'propinsi',
      value: dataLama.kabupaten?.propinsi?.id as string
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
  const {handleSubmit, control, setValue, resetField} = useForm<IKecamatan>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null, nama: undefined, kabupaten: undefined},
    resolver: zodResolver(KecamatanSchema),
  });
  // rtk query
  const { data: postsPropinsi, isLoading: isLoadingPostsPropinsi } = useGetDaftarDataPropinsiQuery(queryPropinsiParams);
  const { data: postsKabupaten, isLoading: isLoadingPostsKabupaten } = useGetDaftarDataKabupatenQuery(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});
  const [ saveKecamatan, {isLoading: isLoadingSaveKecamatan}] = useSaveKecamatanMutation();
  const [ updateKecamatan, {isLoading: isLoadingUpdateKecamatan}] = useUpdateKecamatanMutation();
  const [ updateIdKecamatan, {isLoading: isLoadingUpdateIdKecamatan}] = useUpdateIdKecamatanMutation();
  const [ deleteKecamatan, {isLoading: isLoadingDeleteKecamatan}] = useDeleteKecamatanMutation();

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

  const optionsPropinsi: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsPropinsi?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsPropinsi]
  );

  const optionsKabupaten: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsKabupaten?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsKabupaten]
  );
  
  const onSubmit: SubmitHandler<IKecamatan> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await saveKecamatan(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
          if(dataLama?.id == data.id) {
            await updateKecamatan(data).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }
          else {
            await updateIdKecamatan({idLama: dataLama?.id!, kecamatan: data}).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }          
          hideModal();
          break;
        case 'delete':
          await deleteKecamatan(data).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<IKecamatan> = async (err) => {
    if(mode == 'delete') {
      await deleteKecamatan(dataLama as IKecamatan).unwrap().then((originalPromiseResult) => {
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

  const _resetKabupaten = useCallback(
    () => {
      resetField("kabupaten");
      setSelectedKeyKabupaten(null);
    },
    []
  );

  const _onHandleOnChangePropinsi = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        _resetKabupaten();
        setQueryKabupatenParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;     
                                                    
                if(found == -1) {
                    filters?.push({
                        fieldName: 'propinsi',
                        value: option?.key as string
                    });
                }
                else {
                    filters?.splice(found, 1, {
                        fieldName: 'propinsi',
                        value: option?.key as string
                    })
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
        );
        setSelectedKeyPropinsi(option?.key as string);
    },
    []
  );

  const _onHandleOnChangeKabupaten = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let hasil = cloneDeep(postsKabupaten?.at(index!));
      setValue('kabupaten', hasil!);     
      setSelectedKeyKabupaten(option?.key as string);  
    },
    [postsKabupaten]
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
        {mode == 'add' ? null:   
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
            />   
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
        <ComboBox
            label="Propinsi"
            placeholder="Pilih"
            allowFreeform={true}
            options={optionsPropinsi != undefined ? optionsPropinsi:[]}
            selectedKey={selectedKeyPropinsi}
            useComboBoxAsMenuWidth={true}     
            onChange={_onHandleOnChangePropinsi}
            disabled={mode == 'delete' ? true:disableForm}
        />
        <Controller 
            name="kabupaten"
            control={control}
            render={
            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                <ComboBox
                  label="Kabupaten"
                  placeholder="Pilih"
                  allowFreeform={true}
                  options={optionsKabupaten != undefined ? optionsKabupaten:[]}
                  selectedKey={selectedKeyKabupaten}
                  useComboBoxAsMenuWidth={true}     
                  errorMessage={error && 'harus diisi'}
                  onChange={_onHandleOnChangeKabupaten}
                  disabled={mode == 'delete'||selectedKeyPropinsi == null ? true:disableForm}
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