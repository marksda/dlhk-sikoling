import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useState } from "react";
import { DesaSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IDesa } from "../../features/entity/desa";
import { useDeleteDesaMutation, useSaveDesaMutation, useUpdateDesaMutation, useUpdateIdDesaMutation, useGetDaftarDataPropinsiQuery, useGetDaftarDataKabupatenQuery, useGetDaftarDataKecamatanQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";

interface IFormulirDesaFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IDesa;
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

export const FormulirDesa: FC<IFormulirDesaFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
    // local state
    const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
    const [namaTextFieldValue, setNamaTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nama!:'');
    const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kecamatan?.kabupaten?.propinsi?.id!:undefined);
    const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kecamatan?.kabupaten?.id!:undefined);
    const [selectedKeyKecamatan, setSelectedKeyKecamatan] = useState<string|undefined|null>(dataLama != undefined ? dataLama.kecamatan?.id!:undefined);
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
        value: dataLama.kecamatan?.kabupaten?.propinsi?.id as string
        }],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    const [queryKecamatanParams, setQueryKecamatanParams] = useState<IQueryParamFilters>({
        pageNumber: 1,
        pageSize: 100,
        filters: dataLama == undefined ? []:[{
          fieldName: 'kabupaten',
          value: dataLama.kecamatan?.kabupaten?.id as string
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
    const {handleSubmit, control, setValue, resetField} = useForm<IDesa>({
        defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null, nama: undefined, kecamatan: undefined},
        resolver: zodResolver(DesaSchema),
    });
    // rtk query
    const { data: postsPropinsi, isLoading: isLoadingPostsPropinsi } = useGetDaftarDataPropinsiQuery(queryPropinsiParams);
    const { data: postsKabupaten, isLoading: isLoadingPostsKabupaten } = useGetDaftarDataKabupatenQuery(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});
    const { data: postsKecamatan, isLoading: isLoadingPostsKecamatan } = useGetDaftarDataKecamatanQuery(queryKecamatanParams, {skip: selectedKeyKabupaten == null ? true:false});
    const [ saveDesa, {isLoading: isLoadingSaveDesa}] = useSaveDesaMutation();
    const [ updateDesa, {isLoading: isLoadingUpdateDesa}] = useUpdateDesaMutation();
    const [ updateIdDesa, {isLoading: isLoadingUpdateIdDesa}] = useUpdateIdDesaMutation();
    const [ deleteDesa, {isLoading: isLoadingDeleteDesa}] = useDeleteDesaMutation();

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

    const optionsKecamatan: IComboBoxOption[]|undefined = useMemo(
        () => (
          postsKecamatan?.map((item):IComboBoxOption => {
                  return {
                    key: item.id!,
                    text: item.nama!,
                    data: item
                  };
                })
        ),
        [postsKecamatan]
      );
  
    const onSubmit: SubmitHandler<IDesa> = async (data) => {
        setDisableForm(true);
        try {
            switch (mode) {
                case 'add':
                await saveDesa(data).unwrap().then((originalPromiseResult) => {
                    setDisableForm(false);
                }).catch((rejectedValueOrSerializedError) => {
                    setDisableForm(false);
                }); 
                hideModal();
                break;
                case 'edit':
                if(dataLama?.id == data.id) {
                    await updateDesa(data).unwrap().then((originalPromiseResult) => {
                    setDisableForm(false);
                    }).catch((rejectedValueOrSerializedError) => {
                    setDisableForm(false);
                    }); 
                }
                else {
                    await updateIdDesa({idLama: dataLama?.id!, desa: data}).unwrap().then((originalPromiseResult) => {
                        setDisableForm(false);
                    }).catch((rejectedValueOrSerializedError) => {
                        setDisableForm(false);
                    }); 
                }          
                hideModal();
                break;
                case 'delete':
                await deleteDesa(data).unwrap().then((originalPromiseResult) => {
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

    const onError: SubmitErrorHandler<IDesa> = async (err) => {
        if(mode == 'delete') {
        await deleteDesa(dataLama as IDesa).unwrap().then((originalPromiseResult) => {
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
            _resetKecamatan()
            setSelectedKeyKabupaten(null);
        },
        []
    );

    const _resetKecamatan = useCallback(
        () => {
            resetField("kecamatan");
            setSelectedKeyKecamatan(null);
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
            _resetKecamatan();
            setQueryKecamatanParams(
                prev => {
                    let tmp = cloneDeep(prev);
                    let filters = cloneDeep(tmp.filters);
                    let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;     
                                                        
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'kabupaten',
                            value: option?.key as string
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'kabupaten',
                            value: option?.key as string
                        })
                    }
                    
                    tmp.pageNumber = 1;
                    tmp.filters = filters;             
                    return tmp;
                }
            );
            setSelectedKeyKabupaten(option?.key as string);
        },
        []
    );

    const _onHandleOnChangeKecamatan = useCallback(
        (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
            let kecamatan = cloneDeep(postsKecamatan?.at(index!));
            setValue("kecamatan", kecamatan!);     
            setSelectedKeyKecamatan(option?.key as string);   
        },
        [postsKecamatan]
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
            <ComboBox
                label="Kabupaten"
                placeholder="Pilih"
                allowFreeform={true}
                options={optionsKabupaten != undefined ? optionsKabupaten:[]}
                selectedKey={selectedKeyKabupaten}
                useComboBoxAsMenuWidth={true}     
                onChange={_onHandleOnChangeKabupaten}
                disabled={mode == 'delete'||selectedKeyPropinsi == null ? true:disableForm}
            />
            <Controller 
                name="kecamatan"
                control={control}
                render={
                ({field: {onChange, onBlur}, fieldState: { error }}) => (
                    <ComboBox
                        label="Kecamatan"
                        placeholder="Pilih"
                        allowFreeform={true}
                        options={optionsKecamatan != undefined ? optionsKecamatan:[]}
                        selectedKey={selectedKeyKecamatan}
                        useComboBoxAsMenuWidth={true}     
                        errorMessage={error && 'harus diisi'}
                        onChange={_onHandleOnChangeKecamatan}
                        disabled={mode == 'delete'||selectedKeyKabupaten == null ? true:disableForm}
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