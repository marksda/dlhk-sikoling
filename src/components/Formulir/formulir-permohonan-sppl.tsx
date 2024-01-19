import { ActionButton, ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption, IStackTokens, ITextFieldStyles, ITooltipHostStyles, IconButton, Modal , PrimaryButton, Stack, TextField, TooltipHost, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { RegisterPermohonanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useGetDaftarDataPegawaiQuery, useGetDaftarDataRegisterDokumenQuery, useGetDaftarDataRegisterPerusahaanQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IRegisterPermohonan } from "../../features/entity/register-permohonan";
import { useAppSelector } from "../../app/hooks";
import { invertParseNpwp, utcFormatStringToDDMMYYYY } from "../../features/config/helper-function";
import { IPegawai } from "../../features/entity/pegawai";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";
import { FormulirRegisterDokumen } from "./formulir-register-dokumen";
import find from "lodash.find";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { FormulirRegisterPerusahaan } from "./formulir-register-perusahaan";

interface IFormulirPermohonanSPPLFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IRegisterPermohonan;
  jenisPermohonan: string;
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
const stackTokens: IStackTokens = { childrenGap: 4 };
const calloutProps = { gapSpace: 0 };
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 350 } };
const cancelIcon: IIconProps = { iconName: 'Cancel' };
const addIcon: IIconProps = { iconName: 'PageAdd' };
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
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 400 } };
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } };
const optionsStatusKepemilikanLahan: IComboBoxOption[] = [
  { key: '1', text: 'Milik sendiri' },
  { key: '2', text: 'Pinjam / Sewa pakai' },
];

export const FormulirPermohonanSPPL: FC<IFormulirPermohonanSPPLFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  const token = useAppSelector((state) => state.token);
  // local state
  const [selectedKeyRegisterPerusahaan, setSelectedKeyRegisterPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.registerPerusahaan?.id!:undefined);
  const [selectedKeyRegisterDokumenNib, setSelectedKeyRegisterDokumenNib] = useState<string|undefined|null>(undefined);
  const [selectedKeyPegawai, setSelectedKeyPegawai] = useState<string|undefined|null>(dataLama != undefined ? dataLama.penanggungJawabPermohonan?.id!:undefined);
  const [selectedKeyStatusKepemilikanlahan, setSelectedKeyStatusKepemilikanlahan] = useState<string|undefined>(undefined);
  const [isModalFormulirDokumenNibOpen, {setTrue: showModalFormulirDokumenNib, setFalse: hideModalFormulirDokumenNib}] = useBoolean(false);
  const [isModalFormulirRegisterPerusahaanOpen, {setTrue: showModalFormulirRegisterPerusahaan, setFalse: hideModalFormulirRegisterPerusahaan}] = useBoolean(false);
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:''); 
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  const tooltipId = useId('tooltip');
  //ref component
  const comboBoxPenanggungJawabPermohonanRef = useRef<IComboBox>(null);
  const comboBoxRegisterPerusahaanRef = useRef<IComboBox>(null);
  //hook-form
  const {handleSubmit, control, setValue, resetField} = useForm<IRegisterPermohonan>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null},
    resolver: zodResolver(RegisterPermohonanSchema),
  });
  const [queryPegawaiParams, setQueryPegawaiParams] = useState<IQueryParamFilters>({
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
  const [queryRegisterPerusahaanParams, setQueryRegisterPerusahaanParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: dataLama != undefined ? [{
      fieldName: 'nama',
      value: dataLama.registerPerusahaan?.perusahaan?.nama!
    }]
    : token.hakAkses == 'Umum' ? [{
      fieldName: 'kepemilikan',
      value: token.userId!
    }]:[],
    sortOrders: [
      {
          fieldName: 'nama',
          value: 'ASC'
      },
    ],
  });
  const [queryRegisterDokumenParams, setQueryRegisterDokumenParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: [
      {
        fieldName: 'jenisDokumen',
        value: '11'
      }
    ],
    sortOrders: [
      {
          fieldName: 'nama',
          value: 'ASC'
      },
    ],
  });
  // rtk query
  const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsRegisterPerusahaan } = useGetDaftarDataRegisterPerusahaanQuery(queryRegisterPerusahaanParams);
  const { data: postsPegawai, isLoading: isLoadingPostsPegawai } = useGetDaftarDataPegawaiQuery(queryPegawaiParams, {skip: selectedKeyRegisterPerusahaan == null ? true:false});
  const { data: postsRegisterDokumenNib, isLoading: isLoadingPosts } = useGetDaftarDataRegisterDokumenQuery(queryRegisterDokumenParams, {skip: selectedKeyRegisterPerusahaan == null ? true:false});
  
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

  const optionsPegawai: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsPegawai?.map((item):IComboBoxOption => {
        return {
          key: item.id!,
          text: item.person?.nama!,
          data: item
        };
      })
    ),
    [postsPegawai]
  );

  const optionsRegisterPerusahaan: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsRegisterPerusahaan?.map((item):IComboBoxOption => {
              return {
                key: item.id as string,
                text: `${item.perusahaan?.pelakuUsaha != undefined ? item.perusahaan?.pelakuUsaha?.singkatan+'. ':''}${item.perusahaan?.nama}`,
                data: item
              };
            })
    ),
    [postsRegisterPerusahaan]
  );

  const optionsRegisterDokumenNib: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsRegisterDokumenNib?.map((item):IComboBoxOption => {
              return {
                key: item.id as string,
                text: item.dokumen.nomor,
                data: item
              };
            })
    ),
    [postsRegisterDokumenNib]
  );

  const optionsJenisKegiatanSesuaiKBLI: IComboBoxOption[]|undefined = useMemo(
    () => {
      if(postsRegisterDokumenNib != undefined && selectedKeyRegisterDokumenNib != null) {
        let dataTerpilih = find(postsRegisterDokumenNib, (i) => i.id == selectedKeyRegisterDokumenNib);
        return (dataTerpilih?.dokumen as IDokumenNibOss).daftarKbli?.map((item):IComboBoxOption => {
          return {
            key: item.kode as string,
            text: `${item.kode} - ${item.nama}`,
            data: item
          };
        });
      }
      else {
        return [];
      }
    },
    [postsRegisterDokumenNib, selectedKeyRegisterDokumenNib]
  );
  
  const onSubmit: SubmitHandler<IRegisterPermohonan> = async (data) => {
    console.log(data);
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          // await savePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // hideModal();
          break;
        case 'edit':
          // if(dataLama?.id == data.id) {
          //   await updatePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
          //     setDisableForm(false);
          //   }).catch((rejectedValueOrSerializedError) => {
          //     setDisableForm(false);
          //   }); 
          // }
          // else {
          //   await updateIdPelakuUsaha({idLama: dataLama?.id!, pelakuUsaha: data}).unwrap().then((originalPromiseResult) => {
          //     setDisableForm(false);
          //   }).catch((rejectedValueOrSerializedError) => {
          //     setDisableForm(false);
          //   }); 
          // }          
          // hideModal();
          break;
        case 'delete':
          // await deletePelakuUsaha(data).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<IRegisterPermohonan> = async (err) => {
    if(mode == 'delete') {
      // await deletePelakuUsaha(dataLama!).unwrap().then((originalPromiseResult) => {
      //   setDisableForm(false);
      // }).catch((rejectedValueOrSerializedError) => {
      //   setDisableForm(false);
      // }); 
      // hideModal();
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

  const _onRenderRegisterPerusahaanOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    return item?.data != undefined ?
        <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
        <span><b>
            {
            item!.data!.perusahaan.pelakuUsaha !== undefined ?
            `${item!.data.perusahaan?.pelakuUsaha?.singkatan}. ${item?.data.perusahaan?.nama}` :
            `${item!.data.perusahaan?.nama}`
            }
        </b></span><br />  
        <span>
            {
                item!.data.perusahaan?.id != undefined ?
                invertParseNpwp(item!.data.perusahaan?.id) : `-`
            }
        </span><br />
        <span>
            {
            item!.data.perusahaan?.alamat != undefined ? 
            item!.data.perusahaan?.alamat.keterangan != undefined ? item!.data.perusahaan?.alamat.keterangan:null:null
            }
            {
            item!.data.perusahaan?.alamat != undefined ? 
            item!.data.perusahaan?.alamat.desa != undefined ? `, ${item!.data.perusahaan?.alamat.desa.nama}`:null:null
            }                            
        </span><br />
        <span>
            {
                item!.data.perusahaan?.alamat != undefined ? 
                item!.data.perusahaan?.alamat.kecamatan != undefined ? `${item!.data.perusahaan?.alamat.kecamatan.nama}`:null:null
            }
            {
            item!.data.perusahaan?.alamat != undefined ? 
            item!.data.perusahaan?.alamat.kabupaten != undefined ? `, ${item!.data.perusahaan?.alamat.kabupaten.nama}`:null:null
            }
        </span>
        <span>
            {
            item!.data.perusahaan?.alamat != undefined ? 
            item!.data.perusahaan?.alamat.propinsi != undefined ? `, ${item!.data.perusahaan?.alamat.propinsi.nama}`:null:null
            }
        </span>
        </div>:null;      
  };

  const _onInputComboBoxRegisterPerusahaanValueChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 1) {
        comboBoxRegisterPerusahaanRef.current?.focus(true);
        setQueryRegisterPerusahaanParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
                
                if(newValue != '') {
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'nama',
                            value: newValue
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'nama',
                            value: newValue
                        })
                    }
                }
                else {
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
        );
      }
      else if(newValue == '') {
        setQueryRegisterPerusahaanParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;                 
              console.log(found);
              if(found > -1) {
                filters?.splice(found, 1);
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;    
              return tmp;
          }
        );
      }
    },
    [comboBoxRegisterPerusahaanRef]
  );

  const _resetPenanggungJawabPermohonan = useCallback(
    () => {
      resetField("penanggungJawabPermohonan");
      setSelectedKeyPegawai(null);
    },
    []
  );

  const _resetDokumenNib = useCallback(
    () => {
      // resetField("penanggungJawabPermohonan");
      setSelectedKeyRegisterDokumenNib(null);
    },
    []
  );

  const _onHandleOnChangeRegisterPerusahaanComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      _resetPenanggungJawabPermohonan();
      _resetDokumenNib();
      setQueryPegawaiParams(
        prev => {
            let tmp = cloneDeep(prev);
            let filters = cloneDeep(tmp.filters);
            let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan_id'}) as number;     
                                                
            if(found == -1) {
                filters?.push({
                    fieldName: 'perusahaan_id',
                    value: option?.key as string
                });
            }
            else {
                filters?.splice(found, 1, {
                    fieldName: 'perusahaan_id',
                    value: option?.key as string
                })
            }
            
            tmp.pageNumber = 1;
            tmp.filters = filters;             
            return tmp;
        }
      );
      setQueryRegisterDokumenParams(
        prev => {
            let tmp = cloneDeep(prev);
            let filters = cloneDeep(tmp.filters);
            let found = filters?.findIndex((obj) => {return obj.fieldName == 'id_perusahaan'}) as number;     
                                                
            if(found == -1) {
                filters?.push({
                    fieldName: 'id_perusahaan',
                    value: option?.key as string
                });
            }
            else {
                filters?.splice(found, 1, {
                    fieldName: 'id_perusahaan',
                    value: option?.key as string
                })
            }
            
            tmp.pageNumber = 1;
            tmp.filters = filters;             
            return tmp;
        }
      );
      setSelectedKeyRegisterPerusahaan(option?.key as string);
    },
    [postsRegisterPerusahaan]
  );

  const _onRenderPegawaiOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    let data: IPegawai = item?.data;
    return data != undefined ?
        <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
          <span><b>{data.person?.nama}</b></span><br />  
          <span>{data.person?.nik != undefined ? data.person?.nik : `-`}</span><br />
          <span>{data.jabatan?.nama}</span>
        </div>:null;      
  };

  const _onInputComboBoxPegawaiValueChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 2) {
        comboBoxPenanggungJawabPermohonanRef.current?.focus(true);
        setQueryPegawaiParams(
            prev => {
                let tmp = cloneDeep(prev);
                let filters = cloneDeep(tmp.filters);
                let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;     
                
                if(newValue != '') {
                    if(found == -1) {
                        filters?.push({
                            fieldName: 'pegawai',
                            value: newValue
                        });
                    }
                    else {
                        filters?.splice(found, 1, {
                            fieldName: 'pegawai',
                            value: newValue
                        })
                    }
                }
                else {
                    if(found > -1) {
                        filters?.splice(found, 1);
                    }
                }
                
                tmp.pageNumber = 1;
                tmp.filters = filters;             
                return tmp;
            }
        );
      }
      else if(newValue.length == 0) {
        setQueryPegawaiParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'pegawai'}) as number;                 
              console.log(found);
              if(found > -1) {
                filters?.splice(found, 1);
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;    
              return tmp;
          }
        );
      }
    },
    [comboBoxPenanggungJawabPermohonanRef]
  );

  const _onHandleOnChangeRegisterDokumenNibComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      
      setSelectedKeyRegisterDokumenNib(option?.key as string);
    },
    []
  );

  const _onRenderRegisterDokumenNibOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    let data = item?.data.dokumen as IDokumenNibOss;
    return data != undefined ?
        <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>          
          <span>Nib : <b>{data.nomor}</b>, Tanggal penerbitan : <b>{utcFormatStringToDDMMYYYY(data.tanggal!)}</b></span>
        </div>:null;      
  };

  const _onHandleOnChangeStatusKepemilikanlahanComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {      
      setSelectedKeyStatusKepemilikanlahan(option?.key as string);
    },
    []
  );

  const _onHandleBtnOpenFormulirDokumenNib = useCallback(
    (e) => {            
        e.stopPropagation();
        showModalFormulirDokumenNib();
    },
    [disableForm]
  );

  const _onHandleBtnOpenFormulirRegisterPerusahaan = useCallback(
    (e) => {            
        e.stopPropagation();
        showModalFormulirRegisterPerusahaan();
    },
    [disableForm]
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
        <Stack horizontal  tokens={stackTokens}>    
          <Stack.Item>
            <Controller 
              name="registerPerusahaan"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                  <ComboBox
                    componentRef={comboBoxRegisterPerusahaanRef}
                    label="Pemrakarsa/nama usaha/perusahaan"
                    placeholder="klik atau ketik minimal 2 abjad untuk menampilkan pilihan"
                    allowFreeform={true}
                    options={optionsRegisterPerusahaan != undefined ? optionsRegisterPerusahaan:[]}
                    selectedKey={selectedKeyRegisterPerusahaan}
                    useComboBoxAsMenuWidth={true}
                    onRenderOption={_onRenderRegisterPerusahaanOption}   
                    onInputValueChange={_onInputComboBoxRegisterPerusahaanValueChange}      
                    styles={basicComboBoxStyles}          
                    onChange={_onHandleOnChangeRegisterPerusahaanComboBox}
                    disabled={mode == 'delete' ? true:disableForm}
                  />
                )
              }
            />
          </Stack.Item>
          <Stack.Item style={{paddingTop: 26}}>
            <TooltipHost
              content="Klik untuk menambahkan pilihan pemrakarsa/nama usaha/perusahaan pada combobox disamping icon ini"
              calloutProps={calloutProps}
              styles={hostStyles}
            >
              <ActionButton 
                  iconProps={addIcon} 
                  allowDisabledFocus 
                  onClick={_onHandleBtnOpenFormulirRegisterPerusahaan}
                  disabled={mode == 'delete' ? true:disableForm}
                >
              </ActionButton>
            </TooltipHost>
          </Stack.Item>          
        </Stack>
        <Stack horizontal  tokens={stackTokens}>
          <Stack.Item>
            <ComboBox
              label="Dokumen Nib"
              placeholder="pilih dokumen nib"
              options={optionsRegisterDokumenNib != undefined ? optionsRegisterDokumenNib:[]}
              selectedKey={selectedKeyRegisterDokumenNib}
              useComboBoxAsMenuWidth={true}
              onRenderOption={_onRenderRegisterDokumenNibOption}    
              styles={basicComboBoxStyles}          
              onChange={_onHandleOnChangeRegisterDokumenNibComboBox}
              disabled={mode == 'delete'||selectedKeyRegisterPerusahaan==undefined ? true:disableForm}
            /> 
          </Stack.Item>   
          <Stack.Item style={{paddingTop: 26}}>
            <TooltipHost
              content="Klik untuk menambahkan pilihan dokumen nib pada combobox disamping icon ini"
              id={tooltipId}
              calloutProps={calloutProps}
              styles={hostStyles}
            >
              <ActionButton 
                  iconProps={addIcon} 
                  allowDisabledFocus 
                  onClick={_onHandleBtnOpenFormulirDokumenNib}
                  disabled={mode == 'delete'||selectedKeyRegisterPerusahaan==undefined ? true:disableForm}
                >
              </ActionButton>
            </TooltipHost>
          </Stack.Item>  
        </Stack>        
        <ComboBox
          label="Jenis kegiatan"
          placeholder="silahkan pilih"
          allowFreeform={true}
          options={optionsJenisKegiatanSesuaiKBLI != undefined ? optionsJenisKegiatanSesuaiKBLI:[]}    
          useComboBoxAsMenuWidth={true}
          disabled={mode == 'delete'||selectedKeyRegisterDokumenNib==undefined ? true:disableForm}     
        />
        <ComboBox
          label="Status kepemilikan lahan tempat kegiatan usaha"
          placeholder="silahkan pilih"
          allowFreeform={true}
          options={optionsStatusKepemilikanLahan}   
          selectedKey={selectedKeyStatusKepemilikanlahan} 
          onChange={_onHandleOnChangeStatusKepemilikanlahanComboBox}
          useComboBoxAsMenuWidth={true}
          disabled={mode == 'delete'||selectedKeyRegisterDokumenNib==undefined ? true:disableForm}     
        />
        <Controller 
          name="penanggungJawabPermohonan"
          control={control}
          render={
            ({field: {onChange, onBlur}, fieldState: { error }}) => (
              <ComboBox
                componentRef={comboBoxPenanggungJawabPermohonanRef}
                label="Penanggung jawab permohonan"
                placeholder="silahkan pilih"
                allowFreeform={true}
                options={optionsPegawai != undefined ? optionsPegawai:[]}
                selectedKey={selectedKeyPegawai != undefined ? selectedKeyPegawai:null}
                useComboBoxAsMenuWidth={true}
                onRenderOption={_onRenderPegawaiOption}   
                onInputValueChange={_onInputComboBoxPegawaiValueChange}    
                onChange={(event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                  let penanggungJawab = cloneDeep(postsPegawai?.at(index!));
                  onChange(penanggungJawab);
                  setSelectedKeyPegawai(option?.key as string);
                }}
                disabled={mode == 'delete'||selectedKeyRegisterPerusahaan==undefined ? true:disableForm}
                errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
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
      { isModalFormulirRegisterPerusahaanOpen == true ?
          <FormulirRegisterPerusahaan 
              title="Add perusahaan"
              isModalOpen={isModalFormulirRegisterPerusahaanOpen}
              hideModal={hideModalFormulirRegisterPerusahaan}
              mode="add"
          />:null
      }
      { isModalFormulirDokumenNibOpen == true ?
        <FormulirRegisterDokumen
          title="Add Dokumen Nib"
          isModalOpen={isModalFormulirDokumenNibOpen}
          hideModal={hideModalFormulirDokumenNib}
          mode="add"
          dataLama={{
            id: null,
            dokumen: {
              id: '11',
              nama: 'NIB - OSS',
              nomor: null,
              tanggal: null,
              daftarKbli: []
            },
            registerPerusahaan: find(postsRegisterPerusahaan! as IRegisterPerusahaan[], (item) => {
              return item.id == selectedKeyRegisterPerusahaan;
            }) as IRegisterPerusahaan,
            lokasiFile: null,
            statusDokumen: {
              id: '1',
              nama: 'BERLAKU'
            },
            tanggalRegistrasi: '',
            uploader: {
              id: null
            },
            statusVerified: false
          }}
          lockOptionPerusahaan={true}
        />:null
      }      
    </Modal>
  );
}