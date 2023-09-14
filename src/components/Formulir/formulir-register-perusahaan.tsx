import { ComboBox, ContextualMenu, Dropdown, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IDropdownOption, IDropdownStyles, IIconProps, IconButton, Label, MaskedTextField, Modal, PrimaryButton, Stack, TextField, Toggle, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, FormEvent, useCallback, useMemo, useState } from "react";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseNpwp } from "../../features/config/helper-function";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { RegisterPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { useDeleteRegisterPerusahaanMutation, useGetDaftarDataDesaQuery, useGetDaftarDataKabupatenQuery, useGetDaftarDataKategoriPelakuUsahaQuery, useGetDaftarDataKecamatanQuery, useGetDaftarDataModelPerizinanQuery, useGetDaftarDataPelakuUsahaQuery, useGetDaftarDataPropinsiQuery, useGetDaftarDataSkalaUsahaQuery, useSaveRegisterPerusahaanMutation, useUpdateIdRegisterPerusahaanMutation, useUpdateRegisterPerusahaanMutation } from "../../features/repository/service/sikoling-api-slice";
import cloneDeep from "lodash.clonedeep";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";


interface IFormulirRegisterPerusahaanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  // showModal: () => void;
  hideModal: () => void;
  dataLama?: IRegisterPerusahaan;
};

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    // minWidth: 450
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
const stackTokens = { childrenGap: 8 };
// const col1ComboBoxStyles: Partial<IComboBoxStyles> = { root: { width: 140 } };
const alamatStyles: Partial<IComboBoxStyles> = { root: { width: 253 } };
const dropdownWrapStyles: Partial<IDropdownStyles> = {
  // dropdown: { width: 300 },
  dropdownOptionText: { overflow: 'visible', whiteSpace: 'normal' },
  dropdownItem: { height: 'auto' },
};
const toggleStyles = {
  root: {
      marginBottom: 0,
      width: '150px',
  },
};

export const FormulirRegisterPerusahaan: FC<IFormulirRegisterPerusahaanFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  //local state
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [selectedKeyModelPerizinan, setSelectedKeyModelPerizinan] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.modelPerizinan?.id!:undefined);
  const [selectedKeySkalaUsaha, setSelectedKeySkalaUsaha] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.skalaUsaha?.id!:undefined);
  const [selectedKeyKategoriPelakuUsaha, setSelectedKeyKategoriPelakuUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.kategoriPelakuUsaha?.id!:undefined);
  const [selectedKeyPelakuUsaha, setSelectedKeyPelakuUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.id!:undefined);
  const [selectedKeyPropinsi, setSelectedKeyPropinsi] = useState<string|undefined|null>(dataLama != undefined ? dataLama.perusahaan?.alamat?.propinsi?.id!:undefined);
  const [selectedKeyKabupaten, setSelectedKeyKabupaten] = useState<string|undefined|null>(dataLama != undefined ? dataLama.perusahaan?.alamat?.kabupaten?.id!:undefined);
  const [selectedKeyKecamatan, setSelectedKeyKecamatan] = useState<string|undefined|null>(dataLama != undefined ? dataLama.perusahaan?.alamat?.kecamatan?.id!:undefined);
  const [selectedKeyDesa, setSelectedKeyDesa] = useState<string|undefined|null>(dataLama != undefined ? dataLama.perusahaan?.alamat?.desa?.id!:undefined);
  const [keteranganAlamatTextFieldValue, setKeteranganAlamatTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.perusahaan?.alamat?.keterangan!:'');
  const [teleponeTextFieldValue, setTeleponeTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.perusahaan?.kontak?.telepone!:'');
  const [emailTextFieldValue, setEmailTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.perusahaan?.kontak?.email!:'');
  const [faxTextFieldValue, setFaxTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.perusahaan?.kontak?.fax!:'');
  const [isApproved, setIsApproved] = useState<boolean>(dataLama != undefined ? dataLama.statusVerifikasi!:false);
  const [queryKategoriPelakuUsahaParams, setQueryKategoriPelakuUsahaParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 0,
    filters: dataLama != undefined ? [{
      fieldName: 'id_skala_usaha',
      value: dataLama.perusahaan?.skalaUsaha?.id!
    }]:[],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [queryPelakuUsahaParams, setQueryPelakuUsahaParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 0,
    filters: dataLama != undefined ? [{
      fieldName: 'kategori_pelaku_usaha',
      value: dataLama.perusahaan?.pelakuUsaha?.kategoriPelakuUsaha?.id!
    }]:[],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
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
      value: dataLama.perusahaan?.alamat?.propinsi?.id as string
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
      value: dataLama.perusahaan?.alamat?.kabupaten?.id as string
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
      value: dataLama.perusahaan?.alamat?.kecamatan?.id as string
    }],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [npwpPerusahaan, setNpwpPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.perusahaan?.id!:undefined);
  const [badanUsaha, setBadanUsaha] = useState<string|null|undefined>(dataLama != undefined ? dataLama.perusahaan?.pelakuUsaha?.singkatan!:undefined); 
  const [namaTFValue, setNamaTFValue] = useState<string>(dataLama != undefined ? dataLama.perusahaan?.nama!:'');  
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const titleId = useId('title');
  const { handleSubmit, control, resetField, setValue } = useForm<IRegisterPerusahaan>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
      id: null, tanggalRegistrasi: null, kreator: null, verifikator: null, statusVerifikasi: false   
    },
    resolver: zodResolver(RegisterPerusahaanSchema),
  });
  // rtk query
  const { data: postsModelPerizinan, isLoading: isLoadingPosts } = useGetDaftarDataModelPerizinanQuery({
    pageNumber: 1,
    pageSize: 0,
    filters: [],
    sortOrders: [
      {
        fieldName: 'nama',
        value: 'DES'
      },
    ],
  });
  const { data: postsSkalaUsaha, isLoading: isLoadingPostsSkalaUsaha } = useGetDaftarDataSkalaUsahaQuery({
    pageNumber: 1,
    pageSize: 0,
    filters: [],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const { data: postsKategoriPelakuUsaha, isLoading: isLoadingPostsKategoriPelakuUsaha } = useGetDaftarDataKategoriPelakuUsahaQuery(queryKategoriPelakuUsahaParams, {skip: selectedKeySkalaUsaha == null ? true:false}); 
  const { data: postsPelakuUsaha, isLoading: isLoadingPostsPelakuUsaha } = useGetDaftarDataPelakuUsahaQuery(queryPelakuUsahaParams, {skip: selectedKeyKategoriPelakuUsaha == undefined ? true:false});  
  const { data: postsPropinsi, isLoading: isLoadingPostsPropinsi } = useGetDaftarDataPropinsiQuery(queryPropinsiParams);
  const { data: postsKabupaten, isLoading: isLoadingPostsKabupaten } = useGetDaftarDataKabupatenQuery(queryKabupatenParams, {skip: selectedKeyPropinsi == null ? true:false});
  const { data: postsKecamatan, isLoading: isLoadingPostsKecamatan } = useGetDaftarDataKecamatanQuery(queryKecamatanParams, {skip: selectedKeyKabupaten == null ? true:false});
  const { data: postsDesa, isLoading: isLoadingPostsDesa } = useGetDaftarDataDesaQuery(queryDesaParams, {skip: selectedKeyKecamatan == null ? true:false});
  const [ saveRegisterPerusahaan, {isLoading: isLoadingSaveRegisterPerusahaan}] = useSaveRegisterPerusahaanMutation();
  const [ updateRegisterPerusahaan, {isLoading: isLoadingUpdateRegisterPerusahaan}] = useUpdateRegisterPerusahaanMutation();
  const [ updateIdRegisterPerusahaan, {isLoading: isLoadingUpdateIdRegisterPerusahaan}] = useUpdateIdRegisterPerusahaanMutation();
  const [ deleteRegisterPerusahaan, {isLoading: isLoadingDeleteRegisterPerusahaan}] = useDeleteRegisterPerusahaanMutation();

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

  const optionsModelPerizinan: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsModelPerizinan?.map((item):IComboBoxOption => {
        return {
          key: item.id!,
          text: item.singkatan!,
          data: item
        };
      })
    ),
    [postsModelPerizinan]
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

  const optionsPelakuUsaha: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsPelakuUsaha?.map((item):IComboBoxOption => {
        return {
          key: item.id!,
          text: `${item.nama!} (${item.singkatan!})`,
          data: item
        };
      })
    ),
    [postsPelakuUsaha]
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

  const _onHandleOnChangeModelPerizinanDropDown = useCallback(
    (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
      let modelPerizinan = cloneDeep(postsModelPerizinan?.at(index!));

      setValue('perusahaan.modelPerizinan', modelPerizinan!);
      setSelectedKeyModelPerizinan(option?.key as string);
    },
    [postsModelPerizinan]
  );

  const _onHandleOnChangeSkalaUsahaDropDown = useCallback(
    (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        _resetKategoriPelakuUsaha();
        let skalaUsaha = cloneDeep(postsSkalaUsaha?.at(index!));
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
        setValue('perusahaan.skalaUsaha', skalaUsaha!);
        setSelectedKeySkalaUsaha(option?.key as string);
    },
    [postsSkalaUsaha]
  );

  const _resetKategoriPelakuUsaha = useCallback(
    () => {
      _resetPelakuUsaha();
      setSelectedKeyKategoriPelakuUsaha(null);
    },
    []
  );

  const _resetPelakuUsaha = useCallback(
    () => {
      resetField("perusahaan.pelakuUsaha");
      setSelectedKeyPelakuUsaha(null);
    },
    []
  );

  // const _resetNpwpPerusahaan = useCallback(
  //   () => {
  //     resetField("perusahaan.id");
  //     setNpwpPerusahaan(undefined);
  //   },
  //   []
  // );

  const _onHandleOnChangeKategoriPelakuUsahaDropDown = useCallback(
    (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {        
      _resetPelakuUsaha();

      setQueryPelakuUsahaParams(
        prev => {
            let tmp = cloneDeep(prev);
            let filters = cloneDeep(tmp.filters);
            let found = filters?.findIndex((obj) => {return obj.fieldName == 'kategori_pelaku_usaha'}) as number;     
                                                
            if(found == -1) {
                filters?.push({
                    fieldName: 'kategori_pelaku_usaha',
                    value: option?.key as string
                });
            }
            else {
                filters?.splice(found, 1, {
                    fieldName: 'kategori_pelaku_usaha',
                    value: option?.key as string
                })
            }
            
            tmp.pageNumber = 1;
            tmp.filters = filters;             
            return tmp;
        }
      );
      setSelectedKeyKategoriPelakuUsaha(option?.key as string);
    },
    [postsPelakuUsaha]
  );

  const _onHandleOnChangePelakuUsahaDropDown = useCallback(
    (event: FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) => {
        let pelakuUsaha = cloneDeep(postsPelakuUsaha?.at(index!));  
        setValue('perusahaan.pelakuUsaha', pelakuUsaha!);
        setSelectedKeyPelakuUsaha(option?.key as string);
        setBadanUsaha(pelakuUsaha?.singkatan!);
      },
      [postsPelakuUsaha]
  );

  const _onHandleOnChangeTextFieldNpwpPribadi = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      // setNamaTFValue(newValue || '');
      setNpwpPerusahaan(newValue);

      if(newValue?.length as number > 0) {
        setValue('perusahaan.id', newValue);
      }
      else {
        resetField('perusahaan.id');
      }
    },
    []
  );

  const _onHandleOnChangeTextFieldNpwpBadan = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      let hasilParse = parseNpwp(newValue||'');
      setNpwpPerusahaan(newValue||'');

      if(hasilParse?.length as number > 0) {
        setValue('perusahaan.id', hasilParse);
      }
      else {
        resetField('perusahaan.id');
      }
    },
    []
  );

  const _onHandleOnChangeTextFieldNamaPerusahaan = useCallback(
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setNamaTFValue(newValue || '');
      setValue('perusahaan.nama', newValue!);
    },
    []
  );

  const _resetKabupaten = useCallback(
    () => {
      resetField("perusahaan.alamat.kabupaten");
      setSelectedKeyKabupaten(null);
      _resetKecamatan();
    },
    []
  );

  const _resetKecamatan = useCallback(
    () => {
      resetField("perusahaan.alamat.kecamatan");
      setSelectedKeyKecamatan(null);
      _resetDesa()
    },
    []
  );

  const _resetDesa = useCallback(
    () => {
      resetField("perusahaan.alamat.desa");
      setSelectedKeyDesa(null);
    },
    []
  );

  const _onHandleOnChangeComboBoxPropinsi = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let propinsi = cloneDeep(postsPropinsi?.at(index!));
      setValue("perusahaan.alamat.propinsi", propinsi);
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
    },
    [postsPropinsi]
  );

  const _onHandleOnChangeComboBoxKabupaten = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let kabupaten = cloneDeep(postsKabupaten?.at(index!));
      setValue("perusahaan.alamat.kabupaten", kabupaten);
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
    },
    [postsKabupaten]
  );

  const _onHandleOnChangeComboBoxKecamatan = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let kecamatan = cloneDeep(postsKecamatan?.at(index!));
      setValue("perusahaan.alamat.kecamatan", kecamatan);
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
    },
    [postsKecamatan]
  );

  const _onHandleOnChangeComboBoxDesa = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      let desa = cloneDeep(postsDesa?.at(index!));
      setValue("perusahaan.alamat.desa", desa);
      setSelectedKeyDesa(option?.key as string);
    },
    [postsDesa]
  );

  const _onHandleOnChangeTextFieldDetailAlamat = useCallback(
    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
      setValue("perusahaan.alamat.keterangan", newValue || '-');
      setKeteranganAlamatTextFieldValue(newValue || '');
    },
    []
  );

  const _onChangeApproved = useCallback(
    (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => { 
      setValue("statusVerifikasi", checked!);             
      setIsApproved(checked!);  
    },
    []
  );

  const onSubmit: SubmitHandler<IRegisterPerusahaan> = async (data) => {
    console.log(data);   
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':       
          await saveRegisterPerusahaan(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit': 
          if(dataLama?.id == data.id) { //update non id
            await updateRegisterPerusahaan(data).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            });             
          }
          else { //updare id
            await updateIdRegisterPerusahaan({idLama: `${dataLama?.id}`, registerPerusahaan: data}).unwrap().then((originalPromiseResult) => {
              setDisableForm(false);
            }).catch((rejectedValueOrSerializedError) => {
              setDisableForm(false);
            }); 
          }     
          hideModal();     
          break;
        case 'delete':
          await deleteRegisterPerusahaan(data).unwrap().then((originalPromiseResult) => {
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
  const onError: SubmitErrorHandler<IRegisterPerusahaan> = error => console.log(error);
    
  return (
    <Modal
      titleAriaId={titleId}
      isOpen={isModalOpen}
      isModeless={false}
      containerClassName={contentStyles.container}
      dragOptions={dragOptions}
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
          <Stack.Item style={{width: 200}}>
            <Controller 
              name="perusahaan.modelPerizinan"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                    <Dropdown
                      label="Status OSS"
                      placeholder="--Pilih--"
                      options={optionsModelPerizinan != undefined ? optionsModelPerizinan:[]}
                      onChange={_onHandleOnChangeModelPerizinanDropDown}
                      selectedKey={selectedKeyModelPerizinan != undefined ? selectedKeyModelPerizinan:null}
                      errorMessage={error && 'harus diisi'}
                      disabled={mode == 'delete' ? true:disableForm}
                    />
                )}
            />
          </Stack.Item>
          <Stack.Item style={{width: 350}}>
            <Controller 
              name="perusahaan.skalaUsaha"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                    <Dropdown
                      label="Skala usaha"
                      placeholder="--Pilih--"
                      options={ optionsSkalaUsaha != undefined ? optionsSkalaUsaha:[]}
                      onChange={_onHandleOnChangeSkalaUsahaDropDown}
                      selectedKey={selectedKeySkalaUsaha != undefined ? selectedKeySkalaUsaha:null}
                      disabled={mode == 'delete'||selectedKeyModelPerizinan == undefined ? true:false}
                      errorMessage={error && 'harus diisi'}
                    />
                )}
            />
          </Stack.Item>  
        </Stack>     
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item style={{width: 200}}>              
            <Dropdown
              label="Jenis pelaku usaha"
              placeholder="--Pilih--"
              options={ optionsKategoriPelakuUsaha != undefined ? optionsKategoriPelakuUsaha:[]}
              onChange={_onHandleOnChangeKategoriPelakuUsahaDropDown}
              selectedKey={selectedKeyKategoriPelakuUsaha != undefined ? selectedKeyKategoriPelakuUsaha:null}
              disabled={mode == 'delete'||selectedKeySkalaUsaha == undefined ? true:false}
            />              
          </Stack.Item>  
          <Stack.Item style={{width: 350}}>
            <Controller 
              name="perusahaan.pelakuUsaha"
              control={control}
              render={
                ({
                  field: {onChange}, 
                  fieldState: { error }
                }) => (
                    <Dropdown
                      label="Pelaku usaha"
                      placeholder="--Pilih--"
                      options={ optionsPelakuUsaha != undefined ? optionsPelakuUsaha:[]}
                      styles={dropdownWrapStyles}
                      onChange={_onHandleOnChangePelakuUsahaDropDown}
                      selectedKey={selectedKeyPelakuUsaha != undefined ? selectedKeyPelakuUsaha:null}
                      errorMessage={error && 'harus diisi'}
                      disabled={mode == 'delete'||selectedKeyKategoriPelakuUsaha == undefined ? true:false}
                    />
                )}
            />
          </Stack.Item>  
        </Stack>
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item style={{width: 200}}>
            <Controller 
              name="perusahaan.id"
              control={control}
              render={
                ({
                  field: {onChange}, 
                  fieldState: { error }
                }) => {
                  if(selectedKeyKategoriPelakuUsaha ==  '0101' || selectedKeyKategoriPelakuUsaha ==  '0201') { //pribadi
                    return <TextField 
                      label="NPWP pribadi"
                      placeholder="isikan nik sesuai ktp"
                      value={npwpPerusahaan != undefined ? npwpPerusahaan:''}
                      onChange={_onHandleOnChangeTextFieldNpwpPribadi}
                      disabled={mode == 'delete'||selectedKeyPelakuUsaha == undefined ? true:false}
                      errorMessage={error && (error?.type == "invalid_type"? 'Harus diisi':error.message)}
                    />;                  
                  }
                  else {
                    return <MaskedTextField 
                      label='NPWP badan'
                      mask="99.999.999.9-999.999"
                      value={npwpPerusahaan != undefined ? npwpPerusahaan:''}
                      onChange={_onHandleOnChangeTextFieldNpwpBadan}
                      disabled={mode == 'delete'||selectedKeyPelakuUsaha == undefined ? true:false}
                      errorMessage={error && (error?.type == "invalid_type"? 'Harus diisi':error.message)}
                    />
                  }                            
                }
              }
            />
          </Stack.Item>
          <Stack.Item style={{width: 350}}>
            <Controller 
              name="perusahaan.nama"
              control={control}
              render={
                ({
                  field: {onChange}, 
                  fieldState: { error }
                }) => (
                  <TextField 
                    label="Nama"
                    prefix={badanUsaha == undefined ? "": `${badanUsaha}.`}
                    value={namaTFValue}
                    onChange={_onHandleOnChangeTextFieldNamaPerusahaan}
                    disabled={mode == 'delete'||npwpPerusahaan==undefined?true:false}
                    errorMessage={error && 'Harus diisi'}
                  />
                )}
            />
          </Stack.Item>
        </Stack>
        <Stack horizontal tokens={stackTokens}>
          <Stack.Item style={{width: 200}}>
            <Stack>
              <Stack.Item>
                <Controller 
                  name="perusahaan.kontak.telepone"
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
                          disabled={mode == 'delete'||npwpPerusahaan == undefined ? true:disableForm}
                          errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                      />
                  )}
                />
              </Stack.Item>
              <Stack.Item>
                <Controller 
                  name="perusahaan.kontak.email"
                  control={control}
                  render={
                    ({
                    field: {onChange, onBlur}, 
                    fieldState: { error }
                    }) => (
                      <TextField
                        label="Email"
                        placeholder="isikan email yang aktif"
                        value={emailTextFieldValue}
                        onChange={
                            (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                            onChange(newValue || '');
                            setEmailTextFieldValue(newValue || '');
                            }
                        }
                        disabled={mode == 'delete'||npwpPerusahaan == undefined ? true:disableForm}
                        errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                      />
                    )
                  }
                />
              </Stack.Item>
              <Stack.Item>
                <Controller 
                  name="perusahaan.kontak.fax"
                  control={control}
                  render={
                  ({
                      field: {onChange, onBlur}, 
                      fieldState: { error }
                  }) => (
                      <TextField
                          label="Fax."
                          placeholder="isi kalau ada nomor faximile"
                          value={faxTextFieldValue}
                          onChange={
                          (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                              onChange(newValue || '');
                              setFaxTextFieldValue(newValue || '');
                          }
                          }
                          disabled={mode == 'delete'||npwpPerusahaan == undefined ? true:disableForm}
                          errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                      />
                  )}
                />
              </Stack.Item>
            </Stack>            
          </Stack.Item>
          <Stack.Item style={{width: 350}}>
            <Stack>
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
                          name="perusahaan.alamat.propinsi"
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
                                onChange={_onHandleOnChangeComboBoxPropinsi}
                                disabled={mode == 'delete'||namaTFValue == ''  ? true:disableForm}
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
                          name="perusahaan.alamat.kabupaten"
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
                                onChange={_onHandleOnChangeComboBoxKabupaten}
                                disabled={mode == 'delete'||selectedKeyPropinsi == null||namaTFValue == '' ? true:disableForm}
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
                          name="perusahaan.alamat.kecamatan"
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
                                onChange={_onHandleOnChangeComboBoxKecamatan}
                                disabled={mode == 'delete'||selectedKeyKabupaten == null||namaTFValue == '' ? true:disableForm}
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
                          name="perusahaan.alamat.desa"
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
                                onChange={_onHandleOnChangeComboBoxDesa}
                                disabled={mode == 'delete'||selectedKeyKecamatan == null||namaTFValue == '' ? true:disableForm}
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
                          name="perusahaan.alamat.keterangan"
                          control={control}
                          render={
                            ({field: {onChange, onBlur}, fieldState: { error }}) => (
                              <TextField 
                                placeholder="isikan selain nama propinsi, kabupaten, kecamatan, dan desa. Seperti nama jalan, komplek, blok, rt atau rw"
                                value={keteranganAlamatTextFieldValue}
                                onChange={_onHandleOnChangeTextFieldDetailAlamat}
                                multiline 
                                rows={5}
                                resizable={false}
                                styles={alamatStyles}
                                disabled={mode == 'delete'||selectedKeyDesa == null||namaTFValue == '' ? true:disableForm}
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
        </Stack>  
        <Stack horizontal tokens={stackTokens} style={{marginTop: 8}}>
            <Stack.Item>
                <span style={{width: 60}}>Approved status</span>
            </Stack.Item>
            <Stack.Item>
                <Toggle
                  checked={isApproved}
                  onChange={_onChangeApproved}
                  styles={toggleStyles}
                  onText="Sudah"
                  offText="Belum"
                  disabled={mode == 'delete' ? true:disableForm}
                />
            </Stack.Item>
        </Stack>                                    
        <PrimaryButton 
          style={{marginTop: 16, width: '100%'}}
          text={mode == 'delete' ? 'Hapus':'Simpan'} 
          onClick={handleSubmit(onSubmit, onError)}
        />
      </div>
    </Modal>
  );
}
