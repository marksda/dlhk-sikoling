import { ComboBox, ContextualMenu, FontIcon, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ITextFieldStyles, IconButton, Label, Modal , PrimaryButton, Spinner, SpinnerSize, Stack, TextField, Toggle, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { PersonSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IPerson } from "../../features/entity/person";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { getFileType } from "../../features/config/helper-function";
import { useAddDirekturMutation, useDeletePersonMutation, useGetDaftarDataDesaQuery, useGetDaftarDataJenisKelaminQuery, useGetDaftarDataKabupatenQuery, useGetDaftarDataKecamatanQuery, useGetDaftarDataPersonQuery, useGetDaftarDataPropinsiQuery, useGetDataImageQuery, useSavePersonMutation, useUpdateIdPersonMutation, useUpdatePersonMutation } from "../../features/repository/service/sikoling-api-slice";
import { useAppSelector } from "../../app/hooks";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";


interface IFormulirAddDirekturFluentUIProps {
  title: string|undefined;
  registerPerusahaan?: IRegisterPerusahaan;
  isModalOpen: boolean;
  hideModal: () => void;
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
  },
  infoBoxContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'top',
    alignItems: 'left',
    border: '1px dashed rgb(231 10 10)',
    marginTop: 16,
    width: 400,
    height: 135,
    padding: 4,
  },
});
const stackTokens = { childrenGap: 8 };
const textFieldKtpStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };
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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 250 } };
const alamatStyles: Partial<IComboBoxStyles> = { root: { width: 253 } };
const toggleStyles = {
    root: {
        marginBottom: 0,
        width: '150px',
    },
};

export const FormulirAddDirektur: FC<IFormulirAddDirekturFluentUIProps> = ({title, registerPerusahaan, isModalOpen, hideModal}) => { 
    const token = useAppSelector((state) => state.token);
    // local state
    const [mode, setMode] = useState<string>('add');
    const [dataLama, setDataLama] = useState<IPerson|undefined|null>(undefined);
    const [nikTextFieldValue, setNikTextFieldValue] = useState<string>('');
    const [namaTextFieldValue, setNamaTextFieldValue] = useState<string|undefined>('');
    const [teleponeTextFieldValue, setTeleponeTextFieldValue] = useState<string>('');
    const [emailTextFieldValue, setEmailTextFieldValue] = useState<string>('');
    const [keteranganAlamatTextFieldValue, setKeteranganAlamatTextFieldValue] = useState<string>('');
    const [selectedKeyJenisKelamin, setSelectedKeyJenisKelamin] = useState<string|undefined|null>(undefined);
    const [isApproved, setIsApproved] = useState<boolean>(false);
    const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(undefined);
    const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(undefined);
    const [selectedKeyKecamatan, setSelectedKeyKecamatan] = useState<string|undefined|null>(undefined);
    const [selectedKeyDesa, setSelectedKeyDesa] = useState<string|undefined|null>(undefined);
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
        filters: [],
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
        filters: [],
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
        filters: [],
        sortOrders: [
            {
                fieldName: 'nama',
                value: 'ASC'
            },
        ],
    });
    const [queryParams, setQueryParams] = useState<IQueryParamFilters>({
        pageNumber: 1,
        pageSize: 0,
        filters: [],
        sortOrders: [
            {
                fieldName: 'nik',
                value: 'ASC'
            },
        ],
    });
    const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
    const [disableForm, setDisableForm] = useState<boolean>(false);
    const titleId = useId('title');
    const [selectedFiles, setSelectedFiles] = useState<FileList|undefined|null>(undefined);
    //hook-form
    const {control, setValue, handleSubmit, reset, resetField} = useForm<IPerson>({
        resolver: zodResolver(PersonSchema),
    });
    // rtk query
    const { data: postsPropinsi } = useGetDaftarDataPropinsiQuery(queryPropinsiParams);
    const { data: postsKabupaten } = useGetDaftarDataKabupatenQuery(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});
    const { data: postsKecamatan } = useGetDaftarDataKecamatanQuery(queryKecamatanParams, {skip: selectedKeyKabupaten == null ? true:false});
    const { data: postsDesa } = useGetDaftarDataDesaQuery(queryDesaParams, {skip: selectedKeyKecamatan == null ? true:false});
    const { data: postsJenisKelamin } = useGetDaftarDataJenisKelaminQuery({
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
    const { data: postsPerson, isLoading: isLoadingCheckNik } = useGetDaftarDataPersonQuery(queryParams, {skip: nikTextFieldValue.length == 16 ? false:true}); 
    const [ addDirektur, {isLoading: isLoadingAddDirektur}] = useAddDirekturMutation();
    const [ savePerson, {isLoading: isLoadingSaveHakAkses}] = useSavePersonMutation();
    const [ updatePerson, { isLoading: isLoadingUpdatePerson}] = useUpdatePersonMutation();
    const [ updateIdPerson, { isLoading: isLoadingUpdateIdPerson}] = useUpdateIdPersonMutation();
    const [ deletePerson, { isLoading: isLoadingDeletePerson}] = useDeletePersonMutation();
    const { data: postDataImage, isLoading: isLoadingDataImage, error } = useGetDataImageQuery(
    dataLama == undefined ? '':(dataLama.scanKTP == undefined ? 'kosong':dataLama.scanKTP),
    {skip: dataLama == undefined ? true:false});

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

    const imageKtp = useMemo(
        () => {
            if(error == undefined) {
                return postDataImage;
            }
            else {
                return undefined;
            }
        },
        [postDataImage, error]
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

    useEffect(
        () => {
            if(postsPerson != undefined) {
                if(postsPerson.length == 0) {
                    setNamaTextFieldValue('');
                    setTeleponeTextFieldValue('');
                    setEmailTextFieldValue('');
                    setSelectedKeyJenisKelamin(null);
                    setIsApproved(false);
                    setSelectedKeyPropinsi(undefined);
                    setSelectedKeyKabupaten(undefined);
                    setSelectedKeyKecamatan(undefined);
                    setSelectedKeyDesa(undefined);
                    setKeteranganAlamatTextFieldValue('');

                    setDataLama(null);
                    reset();
                    setValue("nik", nikTextFieldValue);
                    setDisableForm(false);                    
                }
                else {
                    let tempPersonData = cloneDeep(postsPerson[0]); 
                    reset();
                    setNamaTextFieldValue(tempPersonData.nama!);
                    setTeleponeTextFieldValue(tempPersonData.kontak?.telepone!);
                    setEmailTextFieldValue(tempPersonData.kontak?.email!);
                    setSelectedKeyJenisKelamin(tempPersonData.jenisKelamin?.id);
                    setIsApproved(tempPersonData.statusVerified!);
                    setSelectedKeyPropinsi(tempPersonData.alamat?.propinsi ? tempPersonData.alamat?.propinsi?.id:null);
                    _resetKabupaten();
                    tempPersonData.alamat?.propinsi ? setQueryKabupatenParams(
                        prev => {
                            let tmp = cloneDeep(prev);
                            let filters = cloneDeep(tmp.filters);
                            let found = filters?.findIndex((obj) => {return obj.fieldName == 'propinsi'}) as number;     
                                                                
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'propinsi',
                                    value: tempPersonData.alamat?.propinsi?.id!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'propinsi',
                                    value: tempPersonData.alamat?.propinsi?.id!
                                })
                            }
                            
                            tmp.pageNumber = 1;
                            tmp.filters = filters;             
                            return tmp;
                        }
                    ):null;
                    setSelectedKeyKabupaten(tempPersonData.alamat?.kabupaten ? tempPersonData.alamat?.kabupaten?.id!:null);
                    tempPersonData.alamat?.kabupaten ? setQueryKecamatanParams(
                        prev => {
                            let tmp = cloneDeep(prev);
                            let filters = cloneDeep(tmp.filters);
                            let found = filters?.findIndex((obj) => {return obj.fieldName == 'kabupaten'}) as number;     
                                                                
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'kabupaten',
                                    value: tempPersonData.alamat?.kabupaten?.id!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'kabupaten',
                                    value: tempPersonData.alamat?.kabupaten?.id!
                                })
                            }
                            
                            tmp.pageNumber = 1;
                            tmp.filters = filters;             
                            return tmp;
                        }
                    ):null;
                    setSelectedKeyKecamatan(tempPersonData.alamat?.kecamatan ? tempPersonData.alamat?.kecamatan?.id!:null);
                    tempPersonData.alamat?.kecamatan ? setQueryDesaParams(
                        prev => {
                            let tmp = cloneDeep(prev);
                            let filters = cloneDeep(tmp.filters);
                            let found = filters?.findIndex((obj) => {return obj.fieldName == 'kecamatan'}) as number;     
                                                                
                            if(found == -1) {
                                filters?.push({
                                    fieldName: 'kecamatan',
                                    value: tempPersonData.alamat?.kecamatan?.id!
                                });
                            }
                            else {
                                filters?.splice(found, 1, {
                                    fieldName: 'kecamatan',
                                    value: tempPersonData.alamat?.kecamatan?.id!
                                })
                            }
                            
                            tmp.pageNumber = 1;
                            tmp.filters = filters;             
                            return tmp;
                        }
                    ):null;
                    setSelectedKeyDesa(tempPersonData.alamat?.desa ? tempPersonData.alamat?.desa?.id:null);
                    setKeteranganAlamatTextFieldValue(tempPersonData.alamat?.keterangan!);

                    setDataLama(tempPersonData);
                    reset(tempPersonData);  //isi dengan data yang baru diambil via restfull
                    setDisableForm(false);
                }
            }
        },
        [postsPerson, nikTextFieldValue]
    );

    const onSubmit: SubmitHandler<IPerson> = async (data) => {
        setDisableForm(true);
        try {
            let formData = new FormData();    

            if(selectedFiles != undefined && selectedFiles?.length > 0) {
                formData.append('imageKtp', selectedFiles?.item(0)!);
                data.scanKTP = dataLama?.scanKTP!;
            }

            formData.append('personData', JSON.stringify(data));
            formData.append('registerPerusahaanData', JSON.stringify(registerPerusahaan));

            await addDirektur(formData).unwrap().then((originalPromiseResult) => {
                setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
                setDisableForm(false);
            });     
            
            hideModal();
        } catch (error) {
            setDisableForm(false);
        }
    };

    const onError: SubmitErrorHandler<IPerson> = async (err) => {
        if(mode == 'delete') {
        await deletePerson(dataLama as IPerson).unwrap().then((originalPromiseResult) => {
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

    const _resetKabupaten = useCallback(
        () => {
        resetField("alamat.kabupaten");
        setSelectedKeyKabupaten(null);
        _resetKecamatan();
        },
        []
    );

    const _resetKecamatan = useCallback(
        () => {
        resetField("alamat.kecamatan");
        setSelectedKeyKecamatan(null);
        _resetDesa()
        },
        []
    );

    const _resetDesa = useCallback(
        () => {
        resetField("alamat.desa");
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
        (event: FormEvent<HTMLInputElement>, onChange: (s:any) => void ) => {            
            if(event.currentTarget.files!.length > 0) {            
            let fileType: string = getFileType(event.currentTarget.files![0].type);
            let namaFile: string = event.currentTarget.files![0].name;

            if(fileType == 'image') {
                setSelectedFiles(event.currentTarget.files);
                onChange(namaFile);
            }      
            }
        },
        []
    );

    //this function is used to binding button's mouse click event to listener event of input file type Html element
    const _bindClickEventInputFile = useCallback(
        (e) => {            
            e.stopPropagation();
            if(!isApproved && !disableForm) {
                document.getElementById('fileKtpUpload')!.click();
            }        
        },
        [isApproved, disableForm]
    );

    const _handleNikChange = useCallback(
        (textNik) => {
            if(textNik.length == 16) {
                setNikTextFieldValue(textNik);
                setDisableForm(true);
                setQueryParams(
                    prev => {
                        let tmp = cloneDeep(prev);
                        let filters = cloneDeep(tmp.filters);
                        let found = filters?.findIndex((obj) => {return obj.fieldName == 'nik'}) as number;     
                                                
                        if(found == -1) {
                            filters?.push({
                                fieldName: 'nik',
                                value: textNik
                            });
                        }
                        else {
                            filters?.splice(found, 1, {
                                fieldName: 'nik',
                                value: textNik
                            })
                        }
                        
                        tmp.pageNumber = 1;
                        tmp.filters = filters;             
                        return tmp;
                    }
                );                
            }
            else if(textNik.length < 16) {
                setNikTextFieldValue(textNik);
            }             
        },
        []
    );

    const _onChangeApproved = useCallback(
        (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => { 
          setValue("statusVerified", checked!);             
          setIsApproved(checked!);  
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
                                    // onChange(newValue || '');
                                    _handleNikChange(newValue || '');
                                    // setNikTextFieldValue(newValue || '');
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
                                disabled={isApproved ? true:disableForm}
                                errorMessage={error && 'harus diisi'}
                                />
                            )
                        }
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
                                    disabled={isApproved ? true:disableForm}
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
                                disabled={isApproved ? true:disableForm}
                                errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                            />
                            )}
                        />
                    </Stack.Item>
                </Stack>
                <Stack horizontal tokens={stackTokens}>   
                    <Stack.Item>
                        <Stack>                
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
                                            disabled={isApproved ? true:disableForm}
                                        />
                                        )}
                                />                        
                            </Stack.Item>
                            {token.hakAkses == 'Administrator' ?
                            <Stack.Item>
                                <Stack horizontal tokens={stackTokens} style={{marginTop: 16}}>
                                    <Stack.Item>
                                        <span>Approved</span>
                                    </Stack.Item>            
                                    <Stack.Item>
                                        <Toggle
                                            checked={isApproved}
                                            onChange={_onChangeApproved}
                                            styles={toggleStyles}
                                            onText="Sudah"
                                            offText="Belum"
                                            disabled={disableForm}
                                        />
                                    </Stack.Item>
                                </Stack>
                            </Stack.Item>:null        
                            }  
                            {isLoadingCheckNik == true ?
                            <Stack.Item align="center" style={{marginTop: 64}}>
                                <Label>Checking NIK, Please wait...</Label>
                                <Spinner size={SpinnerSize.large} />
                            </Stack.Item>:null
                            }
                        </Stack>
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
                                        disabled={isApproved ? true:disableForm}
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
                                        disabled={isApproved ? true:selectedKeyPropinsi == null ? true:disableForm}
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
                                        disabled={isApproved ? true:selectedKeyKabupaten == null ? true:disableForm}
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
                                        disabled={isApproved ? true:selectedKeyKecamatan == null ? true:disableForm}
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
                                        placeholder="isikan selain nama propinsi, kabupaten, kecamatan, dan desa. Seperti nama jalan, komplek, blok, rt atau rw"
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
                                        disabled={isApproved ? true:selectedKeyDesa == null ? true:disableForm}
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
                <Controller 
                    name="scanKTP"
                    control={control}
                    render={
                        ({
                        field: {onChange, onBlur}, 
                        fieldState: { error }
                        }) => (
                        <>
                            <Label>Upload File gambar ktp</Label>
                            <input type="file" id="fileKtpUpload" style={{display: 'none'}} onChange={
                                (e) => {_handleFile(e, onChange);}
                            }
                            /> 
                            <div className={contentStyles.imageContainer} onClick={_bindClickEventInputFile}> 
                            {
                                (selectedFiles == undefined && dataLama == undefined) ? (
                                <>                  
                                    <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                                    <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih / mengganti file</Label>
                                    <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label><br/>
                                    {
                                    error && (
                                        <Label disabled style={{paddingTop: 0, color: 'red'}}>Error: Anda harus menyertakan file gambar ktp</Label>
                                    )
                                    }
                                </>
                                ) : null
                            }
                            {
                                selectedFiles && (
                                <img
                                    width={400}
                                    height={226}
                                    style={{objectFit: 'contain'}}
                                    // imageFit={ImageFit.centerContain}
                                    src={URL.createObjectURL(selectedFiles[0])}
                                />
                                )
                            }
                            {
                                dataLama != undefined && selectedFiles == undefined && imageKtp != undefined && (
                                <img
                                    width={400}
                                    height={226}
                                    style={{objectFit: 'contain'}}
                                    src={postDataImage}
                                />
                                )
                            }
                            </div>  
                        </>                  
                        )
                    }
                />    
                <div className={contentStyles.infoBoxContainer}>
                <p style={{textAlign: 'justify',textJustify: 'inter-word'}}>
                    <span style={{display: 'inline-block', marginBottom: 6}}><b>Perhatian!!</b></span><br />
                    Harap diisi dengan data yang bisa dipertanggung jawabkan. Data isian anda akan diverifikasi oleh sistem, dan hasilnya akan diberitahukan melalui email user akun yang anda pakai.
                </p>
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