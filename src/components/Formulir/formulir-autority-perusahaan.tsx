import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption, IconButton, Modal, PrimaryButton, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { OtoritasPerusahaanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invertParseNpwp } from "../../features/config/helper-function";
import cloneDeep from "lodash.clonedeep";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { useDeleteMutation, useSaveMutation, useUpdateIdMutation } from "../../features/repository/service/register-otoritas-perusahaan-api-slice";
import { IOtoritasPerusahaan } from "../../features/entity/otoritas-perusahaan";
import { useGetDaftarDataRegisterOtoritasQuery, useGetDaftarDataRegisterPerusahaanQuery } from "../../features/repository/service/sikoling-api-slice";

interface IFormulirAutorityPerusahaanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IOtoritasPerusahaan;
};

// type FormSchemaType = z.infer<typeof OtoritasPerusahaanSchema>;

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
const basicStyles: Partial<IComboBoxStyles> = { root: { width: 400 } };

export const FormulirAutorityPerusahaan: FC<IFormulirAutorityPerusahaanFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  //local state
  const [selectedKeyPerusahaan, setSelectedKeyPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.registerPerusahaan?.id!:undefined);
  const [selectedKeyOtoritas, setSelectedKeyOtoritas] = useState<string|undefined>(dataLama != undefined ? dataLama.otoritas?.id!:undefined);
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [queryPerusahaanParams, setQueryPerusahaanParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: dataLama == undefined ? []:[{
      fieldName: 'nama',
      value: dataLama?.registerPerusahaan?.perusahaan?.nama!
    }],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [queryPengaksesParams, setQueryPengaksesParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: dataLama == undefined ? []:[{
      fieldName: 'user_name',
      value: dataLama.otoritas?.userName!
    }],
    sortOrders: [
        {
            fieldName: 'user_name',
            value: 'ASC'
        },
    ],
  });
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //hook-form
  const {handleSubmit, control, resetField, watch} = useForm<IOtoritasPerusahaan>({
    defaultValues:  cloneDeep(dataLama),
    resolver: zodResolver(OtoritasPerusahaanSchema),
  });
  // rtk query
  const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsPerusahaan } = useGetDaftarDataRegisterPerusahaanQuery(queryPerusahaanParams);
  const { data: postsAuthority, isLoading: isLoadingPostsAuthority } = useGetDaftarDataRegisterOtoritasQuery(queryPengaksesParams);
  const [ saveOtoritasPerusahaan, {isLoading: isLoadingSaveOtoritasPerusahaan}] = useSaveMutation();
  const [ updateIdOtoritasPerusahaan, {isLoading: isLoadingUpdateIdOtoritasPerusahaan}] = useUpdateIdMutation();
  const [ deleteOtoritasPerusahaan, {isLoading: isLoadingDeleteOtoritasPerusahaan}] = useDeleteMutation();
  

  const optionsPerusahaan: IComboBoxOption[]|undefined = useMemo(
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

  const optionsPengakses: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsAuthority?.map((item):IComboBoxOption => {
              return {
                key: item.id as string,
                text: item.userName as string,
                data: item
              };
            })
    ),
    [postsAuthority]
  );
  
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

  const onSubmit: SubmitHandler<IOtoritasPerusahaan> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await saveOtoritasPerusahaan(data as IOtoritasPerusahaan).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'edit':
          await updateIdOtoritasPerusahaan({
            idLamaAutority: dataLama?.otoritas?.id!, 
            idLamaRegisterPerusahaan: dataLama?.registerPerusahaan?.id!, 
            registerOtoritasPerusahaan: data as IOtoritasPerusahaan
          }).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
          break;
        case 'delete':
          await deleteOtoritasPerusahaan(dataLama!).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<IOtoritasPerusahaan> = (err) => {
    console.log(err);
  };

  const _onRenderPerusahaanOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
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

  const _onRenderOptionPengakses = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    return item?.data != undefined ?
          <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
            <span><b>
                {
                item?.data.userName !== undefined ?item.data.userName:'-'
                }
            </b></span><br />  
            <span>{item?.data.person.nama != undefined ? item.data.person.nama:'-'}</span><br />
            <span>{item?.data.person.nik != undefined ? item.data.person.nik:'-'}</span><br />
            <span>
                {
                    item?.data.person.alamat != undefined ? 
                    item?.data.person.alamat.keterangan != undefined ? item.data.person.alamat.keterangan:null:null
                }
                {
                    item?.data.person.alamat != undefined ? 
                    item.data.person.alamat.desa != undefined ? `, ${item.data.person.alamat.desa.nama}`:null:null
                }
            </span><br />
            <span>                            
                {
                    item?.data.person.alamat != undefined ? 
                    item?.data.person.alamat.kecamatan != undefined ? item.data.person.alamat.kecamatan.nama:null:null
                }
                {
                    item?.data.person.alamat != undefined ? 
                    item?.data.person.alamat.kabupaten != undefined ? `, ${item.data.person.alamat.kabupaten.nama}`:null:null
                }
                {
                    item?.data.person.alamat != undefined ? 
                    item?.data.person.alamat.propinsi != undefined ? `, ${item.data.person.alamat.propinsi.nama}`:null:null
                }
            </span>
          </div>:null;      
  };

  const _onInputCBPerusahaanValueChange = useCallback(
    (newValue: string) => {
      // setQueryPerusahaanFilters(
      //   prev => {
      //       let tmp = cloneDeep(prev);
      //       let filters = cloneDeep(tmp.filters);
      //       let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;     
            
      //       if(newValue != '') {
      //           if(found == -1) {
      //               filters?.push({
      //                   fieldName: 'nama',
      //                   value: newValue
      //               });
      //           }
      //           else {
      //               filters?.splice(found, 1, {
      //                   fieldName: 'nama',
      //                   value: newValue
      //               })
      //           }
      //       }
      //       else {
      //           if(found > -1) {
      //               filters?.splice(found, 1);
      //           }
      //       }
            
      //       tmp.filters = filters;             
      //       return tmp;
      //   }
      // );

      setQueryPerusahaanParams(
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
    },
    []
  );

  const _onInputCBPengaksesValueChange = useCallback(
    (newValue: string) => {
      setQueryPengaksesParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;     
              
              if(newValue != '') {
                  if(found == -1) {
                      filters?.push({
                          fieldName: 'user_name',
                          value: newValue
                      });
                  }
                  else {
                      filters?.splice(found, 1, {
                          fieldName: 'user_name',
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
    },
    []
  );

  const _handleOnDismissed = useCallback(
    () => {
      setDisableForm(false);
    },
    []
  );

  // useEffect(
  //   () => {
  //     if(dataLama != undefined) {
  //       setQueryPerusahaanParams(
  //         prev => {
  //             let tmp = cloneDeep(prev);
  //             let filters = cloneDeep(tmp.filters);
  //             let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;    
              
  //             if(found == -1) {
  //                 filters?.push({
  //                     fieldName: 'nama',
  //                     value: dataLama?.registerPerusahaan?.perusahaan?.nama!
  //                 });
  //             }
  //             else {
  //                 filters?.splice(found, 1, {
  //                     fieldName: 'nama',
  //                     value: dataLama?.registerPerusahaan?.perusahaan?.nama!
  //                 })
  //             }
              
  //             tmp.pageNumber = 1;
  //             tmp.filters = filters;             
  //             return tmp;
  //         }
  //       );

  //       setQueryPengaksesParams(
  //         prev => {
  //             let tmp = cloneDeep(prev);
  //             let filters = cloneDeep(tmp.filters);
  //             let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;  
              
  //             if(found == -1) {
  //                 filters?.push({
  //                     fieldName: 'user_name',
  //                     value: dataLama.otoritas?.userName!
  //                 });
  //             }
  //             else {
  //                 filters?.splice(found, 1, {
  //                     fieldName: 'user_name',
  //                     value: dataLama.otoritas?.userName!
  //                 })
  //             }
              
  //             tmp.pageNumber = 1;
  //             tmp.filters = filters;             
  //             return tmp;
  //         }
  //       );
  //     }
  //     else {
  //       setQueryPerusahaanParams(
  //         prev => {
  //             let tmp = cloneDeep(prev);
  //             let filters = cloneDeep(tmp.filters);
  //             let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;    
              
  //             if(found > -1) {
  //               filters?.splice(found, 1);
  //             }
              
  //             tmp.pageNumber = 1;
  //             tmp.filters = filters;             
  //             return tmp;
  //         }
  //       );

  //       setQueryPengaksesParams(
  //         prev => {
  //             let tmp = cloneDeep(prev);
  //             let filters = cloneDeep(tmp.filters);
  //             let found = filters?.findIndex((obj) => {return obj.fieldName == 'user_name'}) as number;  
              
  //             if(found > -1) {
  //               filters?.splice(found, 1);
  //             }
              
  //             tmp.pageNumber = 1;
  //             tmp.filters = filters;             
  //             return tmp;
  //         }
  //       );
  //     }
  //   },
  //   [dataLama]
  // );
  
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
          name="registerPerusahaan"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <ComboBox
                  label="Perusahaan"
                  placeholder="ketik nama perusahaan untuk menampilkan pilihan"
                  allowFreeform={true}
                  options={optionsPerusahaan != undefined ? optionsPerusahaan:[]}
                  selectedKey={selectedKeyPerusahaan}
                  useComboBoxAsMenuWidth={true}
                  onRenderOption={_onRenderPerusahaanOption}   
                  onInputValueChange={_onInputCBPerusahaanValueChange}      
                  styles={basicStyles}           
                  errorMessage={error && 'harus diisi'}
                  onChange={
                    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                      let hasil = cloneDeep(postsRegisterPerusahaan?.at(index!));
                      if(hasil?.kreator == undefined) {
                        hasil!.kreator = null;
                      }
                      if(hasil?.verifikator == undefined) {
                        hasil!.verifikator = null;
                      }                      
                      onChange(hasil);
                      setSelectedKeyPerusahaan(option?.key as string);
                    }
                  }
                  disabled={mode == 'delete' ? true:disableForm}
                />
            )}
        />
        <Controller 
          name="otoritas"
          control={control}
          render={
            ({
              field: {onChange, onBlur}, 
              fieldState: { error }
            }) => (
                <ComboBox
                  label="Pengakses"
                  placeholder="ketik user untuk menampilkan pilihan"
                  allowFreeform={true}
                  options={optionsPengakses != undefined ? optionsPengakses:[]}
                  selectedKey={selectedKeyOtoritas}
                  onChange={
                    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                      onChange(postsAuthority?.at(index!));
                      setSelectedKeyOtoritas(option?.key as string);
                    }
                  }
                  useComboBoxAsMenuWidth={true}
                  onRenderOption={_onRenderOptionPengakses}  
                  onInputValueChange={_onInputCBPengaksesValueChange}         
                  styles={basicStyles}           
                  errorMessage={error && 'harus diisi'}
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
};