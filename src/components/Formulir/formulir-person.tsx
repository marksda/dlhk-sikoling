import { ComboBox, ContextualMenu, FontIcon, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Label, MaskedTextField, Modal , PrimaryButton, Stack, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { PersonSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useDeleteMutation, useSaveMutation, useUpdateMutation } from "../../features/repository/service/hak-akses-api-slice";
import { IPerson } from "../../features/entity/person";
import { useGetDaftarDataQuery as getDaftarJenisKelamin } from "../../features/repository/service/jenis-kelamin-api-slice";
import { useGetDaftarDataQuery as getDaftarPropinsi } from "../../features/repository/service/propinsi-api-slice";
import { useGetDaftarDataQuery as getDaftarKabupaten } from "../../features/repository/service/kabupaten-api-slice";
import { useGetDaftarDataQuery as getDaftarKecamatan } from "../../features/repository/service/kecamatan-api-slice";
import { useGetDaftarDataQuery as getDaftarDesa } from "../../features/repository/service/desa-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { getFileType } from "../../features/config/helper-function";

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
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1px solid #DDDCDC',
    "&:hover": {
        background: "#F4F2F2",
        cursor: 'pointer',
        border: '1px solid #D7D7D7'
    },
    width: 400,
    height: 230,
    padding: 2,
  },
  iconContainer: {
    fontSize: 32,
    height: 36,
    color: '#DDDCDC',
    margin: '0 25px',
  }
});
const stackTokens = { childrenGap: 8 };
const textFieldKtpStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 140 } };
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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 140 } };
const alamatStyles: Partial<IComboBoxStyles> = { root: { width: 253 } };

export const FormulirPerson: FC<IFormulirPersonFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  // local state
  const [nikTextFieldValue, setNikTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.nik!:'');
  const [namaTextFieldValue, setNamaTextFieldValue] = useState<string|undefined>(dataLama != undefined ? dataLama.nama!:'');
  const [teleponeTextFieldValue, setTeleponeTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.kontak?.telepone!:'');
  const [emailTextFieldValue, setEmailTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.kontak?.email!:'');
  const [keteranganAlamatTextFieldValue, setKeteranganAlamatTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.alamat?.keterangan!:'');
  const [selectedKeyJenisKelamin, setSelectedKeyJenisKelamin] = useState<string|undefined|null>(dataLama != undefined ? dataLama.jenisKelamin?.id!:undefined);
  const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(dataLama != undefined ? dataLama.alamat?.propinsi?.id!:undefined);
  const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(dataLama != undefined ? dataLama.alamat?.kabupaten?.id!:undefined);
  const [selectedKeyKecamatan, setSelectedKeyKecamatan] = useState<string|undefined|null>(dataLama != undefined ? dataLama.alamat?.kecamatan?.id!:undefined);
  const [selectedKeyDesa, setSelectedKeyDesa] = useState<string|undefined|null>(dataLama != undefined ? dataLama.alamat?.desa?.id!:undefined);
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
      value: dataLama.alamat?.propinsi?.id as string
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
      value: dataLama.alamat?.kabupaten?.id as string
    }],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [queryDesaParams, setQueryDesaParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 100,
    filters: dataLama == undefined ? []:[{
      fieldName: 'kecamatan',
      value: dataLama.alamat?.kecamatan?.id as string
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
  const [selectedFiles, setSelectedFiles] = useState<any>(undefined);
  //hook-form
  const {control, handleSubmit, resetField, setValue, watch} = useForm<IPerson>({
    defaultValues:  cloneDeep(dataLama),
    resolver: zodResolver(PersonSchema),
  });
  // rtk query
  const { data: postsPropinsi, isLoading: isLoadingPostsPropinsi } = getDaftarPropinsi(queryPropinsiParams);
  const { data: postsKabupaten, isLoading: isLoadingPostsKabupaten } = getDaftarKabupaten(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});
  const { data: postsKecamatan, isLoading: isLoadingPostsKecamatan } = getDaftarKecamatan(queryKecamatanParams, {skip: selectedKeyKabupaten == null ? true:false});
  const { data: postsDesa, isLoading: isLoadingPostsDesa } = getDaftarDesa(queryDesaParams, {skip: selectedKeyKecamatan == null ? true:false});
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
  
  const optionsDesa: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsDesa?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsDesa]
  );

  const onSubmit: SubmitHandler<IPerson> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          console.log(data);
          // await saveHakAkses(data as IPerson).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
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

  const onError: SubmitErrorHandler<IPerson> = (err) => {
    console.log('error', err);
  };

  const _resetKabupaten = useCallback(
    () => {
      setValue("alamat.kabupaten", null);
      setSelectedKeyKabupaten(null);
      _resetKecamatan();
    },
    []
  );

  const _resetKecamatan = useCallback(
    () => {
      setValue("alamat.kecamatan", null);
      setSelectedKeyKecamatan(null);
      _resetDesa()
    },
    []
  );

  const _resetDesa = useCallback(
    () => {
      setValue("alamat.desa", null);
      setSelectedKeyDesa(null);
    },
    []
  );

  const _handleOnDismissed = useCallback(
    () => {
      setDisableForm(false);
    },
    []
  );

  //this function is used to handle responsibility of event File change that occur on input type file HTML Element 
  const _handleFile = useCallback(
    (event: FormEvent<HTMLInputElement>) => {            
        if(event.currentTarget.files!.length > 0) {            
          let fileType: string = getFileType(event.currentTarget.files![0].type);

          if(fileType == 'image') {
            setSelectedFiles(event.currentTarget.files);
          }      
        }
    },
    []
  );

  //this function is used to binding button's mouse click event to listener event of input file type Html element
  const bindClickEventInputFile = useCallback(
    (e) => {            
        e.stopPropagation();
        document.getElementById('fileUpload')!.click();
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
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item>
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item>
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
                                placeholder="Isi sesuai KTP"
                                value={nikTextFieldValue}
                                onChange={
                                (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                  onChange(newValue || '');
                                  setNikTextFieldValue(newValue || '');
                                }
                                }
                                styles={textFieldKtpStyles}
                                disabled={mode == 'delete' ? true:disableForm}
                                errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                            />
                        )}
                    />
                </Stack.Item>
                <Stack.Item>
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
                            placeholder="Isi sesuai KTP"
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
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item>
                    <Controller 
                        name="kontak.telepone"
                        control={control}
                        render={
                        ({
                            field: {onChange, onBlur}, 
                            fieldState: { error }
                        }) => (
                            <TextField
                                label="Telp."
                                placeholder="nomor telepon"
                                value={teleponeTextFieldValue}
                                onChange={
                                (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                    onChange(newValue || '');
                                    setTeleponeTextFieldValue(newValue || '');
                                }
                                }
                                styles={textFieldKtpStyles}
                                disabled={mode == 'delete' ? true:disableForm}
                                errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                            />
                        )}
                    />
                </Stack.Item>
                <Stack.Item>
                    <Controller 
                    name="kontak.email"
                    control={control}
                    render={
                        ({
                        field: {onChange, onBlur}, 
                        fieldState: { error }
                        }) => (
                          <TextField
                            label="Email"
                            placeholder="Isi sesuai penulisan format email"
                            value={emailTextFieldValue}
                            onChange={
                                (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                onChange(newValue || '');
                                setEmailTextFieldValue(newValue || '');
                                }
                            }
                            styles={textFieldStyles}
                            disabled={mode == 'delete' ? true:disableForm}
                            errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                          />
                        )}
                    />
                </Stack.Item>
            </Stack>
            <Stack horizontal tokens={stackTokens}>
              <Stack.Item>
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
              </Stack.Item>
              <Stack.Item>
                <Label>Alamat</Label>
                <Stack style={{border: '1px solid #e1dfdf', padding: 8}} tokens={stackTokens}>
                  <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                      <Stack.Item>
                        <Label style={{width: 72}}>Propinsi</Label>
                      </Stack.Item>
                      <Stack.Item>
                        <Controller 
                          name="alamat.propinsi"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <ComboBox
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsPropinsi != undefined ? optionsPropinsi:[]}
                                selectedKey={selectedKeyPropinsi}
                                useComboBoxAsMenuWidth={true} 
                                styles={alamatStyles}           
                                errorMessage={error && 'harus diisi'}
                                onChange={
                                  (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                                    let hasil = cloneDeep(postsPropinsi?.at(index!));
                                    onChange(hasil);
                                    setSelectedKeyPropinsi(option?.key as string);
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
                                  }
                                }
                                disabled={mode == 'delete' ? true:disableForm}
                              />
                            )
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                      <Stack.Item>
                        <Label style={{width: 72}}>Kabupaten</Label>
                      </Stack.Item>
                      <Stack.Item>
                        <Controller 
                          name="alamat.kabupaten"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <ComboBox
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsKabupaten != undefined ? optionsKabupaten:[]}
                                selectedKey={selectedKeyKabupaten}
                                useComboBoxAsMenuWidth={true} 
                                styles={alamatStyles}           
                                errorMessage={error && 'harus diisi'}
                                onChange={
                                  (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                                    let hasil = cloneDeep(postsKabupaten?.at(index!));
                                    onChange(hasil);
                                    setSelectedKeyKabupaten(option?.key as string);
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
                                  }
                                }
                                disabled={mode == 'delete'||selectedKeyPropinsi == null ? true:disableForm}
                              />
                            )
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                      <Stack.Item>
                        <Label style={{width: 72}}>kecamatan</Label>
                      </Stack.Item>
                      <Stack.Item>
                        <Controller 
                          name="alamat.kecamatan"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <ComboBox
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsKecamatan != undefined ? optionsKecamatan:[]}
                                selectedKey={selectedKeyKecamatan}
                                useComboBoxAsMenuWidth={true} 
                                styles={alamatStyles}           
                                errorMessage={error && 'harus diisi'}
                                onChange={
                                  (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                                    let hasil = cloneDeep(postsKecamatan?.at(index!));
                                    onChange(hasil);
                                    setSelectedKeyKecamatan(option?.key as string);
                                    _resetDesa();
                                    setQueryDesaParams(
                                      prev => {
                                          let tmp = cloneDeep(prev);
                                          let filters = cloneDeep(tmp.filters);
                                          let found = filters?.findIndex((obj) => {return obj.fieldName == 'kecamatan'}) as number;     
                                                                              
                                          if(found == -1) {
                                              filters?.push({
                                                  fieldName: 'kecamatan',
                                                  value: option?.key as string
                                              });
                                          }
                                          else {
                                              filters?.splice(found, 1, {
                                                  fieldName: 'kecamatan',
                                                  value: option?.key as string
                                              })
                                          }
                                          
                                          tmp.pageNumber = 1;
                                          tmp.filters = filters;             
                                          return tmp;
                                      }
                                    );
                                  }
                                }
                                disabled={mode == 'delete'||selectedKeyKabupaten == null ? true:disableForm}
                              />
                            )
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                      <Stack.Item>
                        <Label style={{width: 72}}>Desa</Label>
                      </Stack.Item>
                      <Stack.Item>
                        <Controller 
                          name="alamat.desa"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <ComboBox
                                placeholder="Pilih"
                                allowFreeform={true}
                                options={optionsDesa != undefined ? optionsDesa:[]}
                                selectedKey={selectedKeyDesa}
                                useComboBoxAsMenuWidth={true} 
                                styles={alamatStyles}           
                                errorMessage={error && 'harus diisi'}
                                onChange={
                                  (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                                    let hasil = cloneDeep(postsDesa?.at(index!));
                                    onChange(hasil);
                                    setSelectedKeyDesa(option?.key as string);
                                  }
                                }
                                disabled={mode == 'delete'||selectedKeyKecamatan == null ? true:disableForm}
                              />
                            )
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>      
                  <Stack.Item>
                    <Stack horizontal tokens={stackTokens}>
                      <Stack.Item>
                        <Label style={{width: 72}}>Detail</Label>
                      </Stack.Item>
                      <Stack.Item>
                        <Controller 
                          name="alamat.keterangan"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <TextField 
                                placeholder="isikan selain propinsi, kabupaten, kecamatan, atau desa. Seperti nama jalan, komplek, blok, rt atau rw"
                                value={keteranganAlamatTextFieldValue}
                                onChange={
                                (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                    onChange(newValue || '');
                                    setKeteranganAlamatTextFieldValue(newValue || '');
                                }
                                }
                                multiline 
                                rows={5}
                                resizable={false}
                                styles={alamatStyles}
                                disabled={mode == 'delete'||selectedKeyDesa == null ? true:disableForm}
                                errorMessage={error && 'harus diisi'}
                              />                          
                            )
                          }
                        />
                      </Stack.Item>
                    </Stack>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>  
          </Stack.Item>
          <Stack.Item>
            <Label>Upload File gambar ktp</Label>
            <input type="file" id="fileUpload" style={{display: 'none'}} onChange={_handleFile}/> 
            <div className={contentStyles.imageContainer} onClick={bindClickEventInputFile}> 
              {
                !selectedFiles && (
                <>                  
                  <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                  <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih / mengganti file</Label>
                  <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label>
                </>
                )
              }
            </div>            
          </Stack.Item>
        </Stack>      
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