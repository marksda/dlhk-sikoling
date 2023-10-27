import { ActionButton, Checkbox, ComboBox, ContextualMenu, FontWeights, IComboBox, IComboBoxOption, IComboBoxStyles, IDragOptions, IIconProps, ISelectableOption, IStackTokens, ITextFieldStyles, IconButton, Modal , PrimaryButton, Stack, TextField, getTheme, mergeStyleSets } from "@fluentui/react";
import { useBoolean, useId } from "@fluentui/react-hooks";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { OtoritasSchema } from "../../features/schema-resolver/zod-schema";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import cloneDeep from "lodash.clonedeep";
import { IHakAkses } from "../../features/entity/hak-akses";
import { IOtoritas } from "../../features/entity/otoritas";
import { useDeleteHakAksesMutation, useGetDaftarDataHakAksesQuery, useGetDaftarDataPersonQuery, useSaveHakAksesMutation, useUpdateHakAksesMutation } from "../../features/repository/service/sikoling-api-slice";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { FormulirPerson } from "./formulir-person";

interface IFormulirOtoritasFluentUIProps {
  title: string|undefined;
  mode: string|undefined;
  isModalOpen: boolean;
  showModal: () => void;
  hideModal: () => void;
  dataLama?: IOtoritas;
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
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { minWidth: 350 } };
const textPasswordFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 250 } };
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
// const basicStyles: Partial<IComboBoxStyles> = { root: { width: 400 } };
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { width: 400 } };
const addIcon: IIconProps = { iconName: 'AddFriend' };
const containerPasswordStackTokens: IStackTokens = { childrenGap: 12 };

export const FormulirOtoritas: FC<IFormulirOtoritasFluentUIProps> = ({title, isModalOpen, showModal, hideModal, dataLama, mode}) => { 
  // local state
  const [idTextFieldValue, setIdTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.id!:'');
  const [userNameTextFieldValue, setUserNameTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.userName!:'');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [selectedKeyPerson, setSelectedKeyPerson] = useState<string|undefined>(dataLama != undefined ? dataLama.person?.nik!:undefined);
  const [selectedKeyHakAkses, setSelectedKeyHakAkses] = useState<string|undefined|null>(dataLama != undefined ? dataLama.hakAkses?.id!:undefined);
  const [queryPersonParams, setQueryPersonParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: dataLama != undefined ? [{
      fieldName: 'nama',
      value: dataLama.person?.nama!
    }]:[],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
  const [queryHakAksesParams, setQueryHakAksesParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 25,
    filters: dataLama != undefined ? [{
      fieldName: 'nama',
      value: dataLama.hakAkses?.nama!
    }]:[],
    sortOrders: [
        {
            fieldName: 'nama',
            value: 'ASC'
        },
    ],
  });
//   const [keteranganTextFieldValue, setKeteranganTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.keterangan!:'');
  const [keepInBounds, { toggle: toggleKeepInBounds }] = useBoolean(false);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [isGeneratedPassword, setIsGeneratePassword] = useState<boolean>(true);
  const titleId = useId('title');
  const comboBoxPersonRef = useRef<IComboBox>(null);
  const comboBoxHakAksesRef = useRef<IComboBox>(null);
  const [isModalFormulirPersonOpen, {setTrue: showModalFormulirPerson, setFalse: hideModalFormulirPerson}] = useBoolean(false);
  //hook-form
  const {handleSubmit, control, setValue, resetField} = useForm<IOtoritas>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):undefined,
    resolver: zodResolver(OtoritasSchema),
  });
  // rtk query
  const [ saveHakAkses ] = useSaveHakAksesMutation();
  const [ updateHakAkses ] = useUpdateHakAksesMutation();
  const [ deleteHakAkses ] = useDeleteHakAksesMutation();
  const { data: postsPerson, isLoading: isLoadingPostsPerson } = useGetDaftarDataPersonQuery(queryPersonParams);
  const { data: postsHakAkses, isLoading: isLoadingPostsHakakses } = useGetDaftarDataHakAksesQuery(queryHakAksesParams);

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

  const optionsPerson: IComboBoxOption[]|undefined = useMemo(
    () => (
        postsPerson?.map((item):IComboBoxOption => {
              return {
                key: item.nik!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsPerson]
  );

  const optionsHakAkses: IComboBoxOption[]|undefined = useMemo(
    () => (
      postsHakAkses?.map((item):IComboBoxOption => {
              return {
                key: item.id!,
                text: item.nama!,
                data: item
              };
            })
    ),
    [postsHakAkses]
  );
  
  const onSubmit: SubmitHandler<IOtoritas> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':
          await saveHakAkses(data as IOtoritas).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          hideModal();
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

  const onError: SubmitErrorHandler<IHakAkses> = (err) => {
    console.log(err);
  };

  const _handleOnDismissed = useCallback(
    () => {
      setDisableForm(false);
    },
    []
  );

  const _onRenderPersonOption = (item: IComboBoxOption|ISelectableOption<any>|undefined) => {
    return item?.data != undefined ?
          <div style={{padding: 4, borderBottom: '1px solid #d9d9d9', width: 380}}>
            <span><b>{item?.data.nama != undefined ? item.data.nama:'-'}</b></span><br />
            <span>{item?.data.nik != undefined ? item.data.nik:'-'}</span><br />
            <span>
                {
                    item?.data.alamat != undefined ? 
                    item?.data.alamat.keterangan != undefined ? item.data.alamat.keterangan:null:null
                }
                {
                    item?.data.alamat != undefined ? 
                    item.data.alamat.desa != undefined ? `, ${item.data.alamat.desa.nama}`:null:null
                }
            </span><br />
            <span>                            
                {
                    item?.data.alamat != undefined ? 
                    item?.data.alamat.kecamatan != undefined ? item.data.alamat.kecamatan.nama:null:null
                }
                {
                    item?.data.alamat != undefined ? 
                    item?.data.alamat.kabupaten != undefined ? `, ${item.data.alamat.kabupaten.nama}`:null:null
                }
                {
                    item?.data.alamat != undefined ? 
                    item?.data.alamat.propinsi != undefined ? `, ${item.data.alamat.propinsi.nama}`:null:null
                }
            </span>
          </div>:null;      
  };

  const _onInputComboBoxPersonValueChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 2) {
        comboBoxPersonRef.current?.focus(true);
        setQueryPersonParams(
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
    },
    []
  );

  const _onHandleOnChangePersonComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        let person = cloneDeep(postsPerson?.at(index!));
        if(person?.nik == undefined) {
            person!.nik = null;
        }
        if(person?.jenisKelamin == undefined) {
            person!.jenisKelamin = null;
        } 
        if(person?.alamat == undefined) {
            person!.alamat = null;
        } 
        if(person?.kontak == undefined) {
            person!.kontak = null;
        }  
        if(person?.scanKTP == undefined) {
            person!.scanKTP = null;
        }          

        setValue('person', person!);
        setSelectedKeyPerson(option?.key as string);
      },
      [postsPerson]
  );

  const _onHandleBtnAddPerson = useCallback(
    (e) => {            
        e.stopPropagation();
        showModalFormulirPerson();
    },
    [disableForm]
  );

  const onChangeGeneratePassword = useCallback(
    (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void => {
      setIsGeneratePassword(!!checked);
    },
    [],
  );
  
  const _onInputComboBoxHakAksesValueChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 2) {
        comboBoxHakAksesRef.current?.focus(true);
        setQueryHakAksesParams(
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
      else if(newValue.length == 0) {
        setSelectedKeyHakAkses(undefined);
        resetField("hakAkses");
        setQueryHakAksesParams(
          prev => {
            let tmp = cloneDeep(prev);
            let filters = cloneDeep(tmp.filters);
            let found = filters?.findIndex((obj) => {return obj.fieldName == 'nama'}) as number;
            
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
    []
  );

  const _onHandleOnChangeHakAksesComboBox = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
        let hakAkses = cloneDeep(postsHakAkses?.at(index!));
        setValue('hakAkses', hakAkses!);
        setSelectedKeyHakAkses(option?.key as string);
      },
      [postsHakAkses]
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
        <Stack>  
          <Stack.Item>
            <Controller 
              name="userName"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                    <TextField
                      label="User name"
                      placeholder="Isi dengan alamat email yang masih aktif"
                      value={userNameTextFieldValue}
                      onChange={
                        (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                          onChange(newValue || '');
                          setUserNameTextFieldValue(newValue || '');
                        }
                      }
                      styles={textFieldStyles}
                      disabled={mode == 'delete' ? true:disableForm}
                      errorMessage={error && 'harus diisi'}
                    />
                )}
            />
          </Stack.Item>
          <Stack.Item>
            <Stack horizontal  tokens={containerPasswordStackTokens}>
              <Stack.Item align="center">
                <TextField
                  label="Password"
                  placeholder="Isikan password"
                  value={passwordValue}
                  onChange={
                    (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                      setPasswordValue(newValue || '');
                    }
                  }
                  styles={textPasswordFieldStyles}
                  disabled={(mode == 'delete'||isGeneratedPassword == true) ? true:disableForm}
                />
              </Stack.Item>
              <Stack.Item align="center" style={{paddingTop: 28}}>
                <Checkbox label="Generate password" checked={isGeneratedPassword} onChange={onChangeGeneratePassword} />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <Controller 
              name="person"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                  <ComboBox
                    componentRef={comboBoxPersonRef}
                    label="Person"
                    placeholder="ketik minimal 3 abjad untuk menampilkan pilihan person"
                    allowFreeform={true}
                    autoComplete={'off'}
                    options={optionsPerson != undefined ? optionsPerson:[]}
                    selectedKey={selectedKeyPerson}
                    useComboBoxAsMenuWidth={true}
                    onRenderOption={_onRenderPersonOption}   
                    onInputValueChange={_onInputComboBoxPersonValueChange}      
                    styles={basicComboBoxStyles}           
                    errorMessage={error && 'harus diisi'}
                    onChange={_onHandleOnChangePersonComboBox}
                    disabled={mode == 'delete' ? true:disableForm}
                  />
                )}
            />
          </Stack.Item>
          <Stack.Item>
            <Controller 
              name="hakAkses"
              control={control}
              render={
                ({
                  field: {onChange, onBlur}, 
                  fieldState: { error }
                }) => (
                  <ComboBox
                    componentRef={comboBoxHakAksesRef}
                    label="Hak akses"
                    placeholder="pilihan hak akses"
                    allowFreeform={true}
                    autoComplete={'off'}
                    options={optionsHakAkses != undefined ? optionsHakAkses:[]}
                    selectedKey={selectedKeyHakAkses==undefined?null:selectedKeyHakAkses}
                    useComboBoxAsMenuWidth={true}
                    // onRenderOption={_onRenderHakAksesOption}   
                    onInputValueChange={_onInputComboBoxHakAksesValueChange}      
                    styles={basicComboBoxStyles}           
                    errorMessage={error && 'harus diisi'}
                    onChange={_onHandleOnChangeHakAksesComboBox}
                    disabled={mode == 'delete' ? true:disableForm}
                  />
                )}
            />
          </Stack.Item>
          <Stack.Item>
            <ActionButton 
              iconProps={addIcon} 
              allowDisabledFocus 
              onClick={_onHandleBtnAddPerson}
            >
            Add pilihan person
            </ActionButton>
          </Stack.Item>
          {mode == 'add' ? null:
            <Stack.Item>
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
                        disabled={mode == 'delete'|| mode == 'edit' ? true:disableForm}
                        errorMessage={error && 'harus diisi'}
                      />
                  )}
              />
            </Stack.Item>
          }
          <PrimaryButton 
            style={{marginTop: 16, width: '100%'}}
            text={mode == 'delete' ? 'Hapus':'Simpan'} 
            onClick={handleSubmit(onSubmit, onError)}
            disabled={disableForm}
          />
        </Stack>
      </div>
      { isModalFormulirPersonOpen == true ?
        <FormulirPerson
          title="Add Person"
          isModalOpen={isModalFormulirPersonOpen}
          showModal={showModalFormulirPerson}
          hideModal={hideModalFormulirPerson}
          mode="add"
        />:null
      }       
    </Modal>
  );
}