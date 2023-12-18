import { ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption, ITextFieldStyles, IconButton, Modal , PrimaryButton, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { RegisterPermohonanSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { useGetDaftarDataRegisterPerusahaanQuery } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IRegisterPermohonan } from "../../features/entity/register-permohonan";
import { useAppSelector } from "../../app/hooks";
import { invertParseNpwp } from "../../features/config/helper-function";

interface IFormulirPermohonanFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  hideModal: () => void;
  dataLama?: IRegisterPermohonan;
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
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 400 } };

export const FormulirPermohonan: FC<IFormulirPermohonanFluentUIProps> = ({title, isModalOpen, hideModal, dataLama, mode}) => { 
  const token = useAppSelector((state) => state.token);
  // local state
  const [selectedKeyRegisterPerusahaan, setSelectedKeyRegisterPerusahaan] = useState<string|undefined>(dataLama != undefined ? dataLama.registerPerusahaan?.id!:undefined);
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:''); 
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const titleId = useId('title');
  //ref component
  const comboBoxRegisterPerusahaanRef = useRef<IComboBox>(null);
  //hook-form
  const {handleSubmit, control, setValue, resetField} = useForm<IRegisterPermohonan>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{id: null},
    resolver: zodResolver(RegisterPermohonanSchema),
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
  // rtk query
  const { data: postsRegisterPerusahaan, isLoading: isLoadingPostsRegisterPerusahaan } = useGetDaftarDataRegisterPerusahaanQuery(queryRegisterPerusahaanParams);
  
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

  const _onHandleOnChangeRegisterPerusahaanComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
      setSelectedKeyRegisterPerusahaan(option?.key as string);
    },
    [postsRegisterPerusahaan]
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