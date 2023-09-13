import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { ComboBox, DatePicker, DayOfWeek, DefaultButton, FontIcon, IComboBox, IComboBoxOption, IComboBoxStyles, IDatePickerStyleProps, IDatePickerStyles, ISelectableOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Spinner, SpinnerSize, Stack, TextField, mergeStyleSets } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteRegisterDokumenMutation, useGetDaftarDataPegawaiQuery, useGetOnlyofficeConfigEditorMutation, useReplaceFileMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { DayPickerIndonesiaStrings, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IPegawai } from "../../features/entity/pegawai";
import { utcFormatDateToDDMMYYYY } from "../../features/config/helper-function";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlDocumenService } from "../../features/config/config";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { RegisterDokumenAktaPendirianSchema } from "../../features/schema-resolver/zod-schema";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IDokumen } from "../../features/entity/dokumen";


interface IFormulirRegisterDokumenAktaPendirianFluentUIProps {
  mode?: string;
  dokumen?: IDokumen;
  registerPerusahaan?: IRegisterPerusahaan;
  dataLama?: IRegisterDokumen<IDokumenAktaPendirian>;
  closeWindow: () => void;
};
const stackTokens = { childrenGap: 4 };
const dateStyle: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
  root: {
    width: 250
  }
};
const contentStyles = mergeStyleSets({
  fileViewContainer: {
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
    width: 800,
    height: 100,
    padding: '16px 16px 0px 16px',
  },
  iconContainer: {
    fontSize: 32,
    height: 36,
    color: '#DDDCDC',
    margin: '0 25px',
  },
});
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200 } };
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 200 } };

export const FormulirRegisterDokumenAktaPendirian: FC<IFormulirRegisterDokumenAktaPendirianFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => { 
  // const token = useAppSelector((state) => state.token);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? new Date(dataLama.dokumen?.tanggal!):undefined); 
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.nomor!:'');
  const [notarisTextFieldValue, setNotarisTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.namaNotaris!:'');
  const [selectedKeyPegawai, setSelectedKeyPegawai] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen?.penanggungJawab?.id!:undefined);
  const [queryPegawaiParams, setQueryPegawaiParams] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 0,
    filters: [{
      fieldName: 'perusahaan_id',
      value: registerPerusahaan?.id!
    }],
    sortOrders: [
      {
        fieldName: 'nama',
        value: 'ASC'
      },
    ],
  });
  const [disableForm, setDisableForm] = useState<boolean>(mode == 'delete' ? false:true);
  const [configOnlyOfficeEditor, setConfigOnlyOfficeEditor] = useState<any|null>(null);
  const comboBoxPenanggungJawabRef = useRef<IComboBox>(null);
  //react hook-form
  const {handleSubmit, control, setValue, resetField} = useForm<IRegisterDokumen<IDokumenAktaPendirian>>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
      id: null,
      registerPerusahaan: {id: registerPerusahaan?.id},
      dokumen: {...dokumen}
    },
    resolver: zodResolver(RegisterDokumenAktaPendirianSchema)
  });
  //rtk query
  const { data: postsPegawai, isLoading: isLoadingPostsPegawai } = useGetDaftarDataPegawaiQuery(queryPegawaiParams);
  const [ saveRegisterDokumen, {isLoading: isLoadingSaveRegisterDokumen}] = useSaveRegisterDokumenMutation();
  const [ updateRegisterDokumen, {isLoading: isLoadingUpdateRegisterDokumen}] = useUpdateRegisterDokumenMutation();
  const [ deleteRegisterDokumen, {isLoading: isLoadingDeleteRegisterDokumen}] = useDeleteRegisterDokumenMutation();
  const [ uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
  const [ replaceFile, {isLoading: isLoadingReplaceFile}] = useReplaceFileMutation();
  const [ getOnlyofficeConfigEditor, {isLoading: isLoadingGetOnlyofficeConfigEditor}] = useGetOnlyofficeConfigEditorMutation();
  
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
        comboBoxPenanggungJawabRef.current?.focus(true);
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
    [comboBoxPenanggungJawabRef]
  );

  useEffect(
    () => {
      if(registerPerusahaan != undefined) {        
        resetField('dokumen.penanggungJawab');
        if(mode == 'add') {
          setSelectedKeyPegawai(undefined);
        }        
        setQueryPegawaiParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan_id'}) as number;                   
              
              if(found == -1) {
                  filters?.push({
                      fieldName: 'perusahaan_id',
                      value: registerPerusahaan.id!
                  });
              }
              else {
                  filters?.splice(found, 1, {
                      fieldName: 'perusahaan_id',
                      value: registerPerusahaan.id!
                  })
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;             
              return tmp;
          }
        );
      }

      if(mode != 'add') {
        setQueryPegawaiParams(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan_id'}) as number;                   
              
              if(found == -1) {
                  filters?.push({
                      fieldName: 'perusahaan_id',
                      value: dataLama?.registerPerusahaan?.id!
                  });
              }
              else {
                  filters?.splice(found, 1, {
                      fieldName: 'perusahaan_id',
                      value: dataLama?.registerPerusahaan?.id!
                  })
              }
              
              tmp.pageNumber = 1;
              tmp.filters = filters;             
              return tmp;
          }
        );

        getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${dataLama?.lokasiFile}`).unwrap()
          .then((secondPromiseResult) => {
            setDisableForm(false);
            let hasil = cloneDeep(secondPromiseResult);
            hasil.height = `${window.innerHeight - 130}px`;  
            hasil.width =  `${window.innerWidth - 360}px`;                 
            setConfigOnlyOfficeEditor(hasil);
          })
          .catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          });
      }
    },
    [mode, registerPerusahaan]
  );

  useEffect(
    () => {
      function handleResize() {
        setConfigOnlyOfficeEditor(
          (prev: any) => {
            let hasil = cloneDeep(prev);
            hasil.height = mode == 'add' ? `${window.innerHeight - 195}px` : `${window.innerHeight - 130}px`;
            hasil.width = `${window.innerWidth - 360}px`; 
            return hasil;
          }
        );
      }

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    },
    []
  );

  const _handleFile = useCallback(
    (event: FormEvent<HTMLInputElement>) => {            
        if(event.currentTarget.files!.length > 0) {            
          // let fileType: string = getFileType(event.currentTarget.files![0].type);
          let file = event.currentTarget.files![0];
          let namaFile = file.name;
          let formData;
          let parm;     

          switch (mode) {
            case 'add':
              formData = new FormData();
              formData.append('file', file);
              parm = {
                subPath: `/file/upload?fileNameParam=/${dokumen?.nama}/temp/${namaFile}`,
                dataForm: formData
              };  
              uploadFile(parm).unwrap()
                .then((firstPromiseResult) => {
                  setValue("lokasiFile", firstPromiseResult.uri);
                  getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${firstPromiseResult.uri}`).unwrap()
                    .then((secondPromiseResult) => {
                      setDisableForm(false);
                      let hasil = cloneDeep(secondPromiseResult);
                      hasil.height = `${window.innerHeight - 195}px`;            
                      hasil.width =  `${window.innerWidth - 310}px`; 
                      setConfigOnlyOfficeEditor(hasil);
                    })
                    .catch((rejectedValueOrSerializedError) => {
                      setDisableForm(false);
                    });
                })
                .catch((rejectedValueOrSerializedError) => {
                  setDisableForm(false);
                }); 
              break;
            case 'edit':
              formData = new FormData();
              formData.append('file', file);
              formData.append('idRegisterDokumen', dataLama?.id!);
              parm = {
                subPath: `/file/replace?fileNameParam=${namaFile}`,
                dataForm: formData
              };  
              replaceFile(parm).unwrap()
                .then((firstPromiseResult) => {
                  setValue("lokasiFile", firstPromiseResult.uri);
                  getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${firstPromiseResult.uri}`).unwrap()
                    .then((secondPromiseResult) => {
                      setDisableForm(false);
                      let hasil = cloneDeep(secondPromiseResult);
                      hasil.height = `${window.innerHeight - 195}px`;            
                      hasil.width =  `${window.innerWidth - 360}px`; 
                      setConfigOnlyOfficeEditor(hasil);
                    })
                    .catch((rejectedValueOrSerializedError) => {
                      setDisableForm(false);
                    });
                })
                .catch((rejectedValueOrSerializedError) => {
                  setDisableForm(false);
                }); 
              break;
            default:
              break;
          }
        }
    },
    [mode, dataLama]
  );

  const _bindClickEventInputFile = useCallback(
    (e) => {            
        e.stopPropagation();
        // if(!disableForm) {
          document.getElementById('fileUpload')!.click();
        // }        
    },
    [disableForm]
  );

  const onSubmit: SubmitHandler<IRegisterDokumen<IDokumenAktaPendirian>> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':          
          await saveRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          closeWindow();
          break;
        case 'edit':
          await updateRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          closeWindow();
          break;
        case 'delete':
          await deleteRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
            setDisableForm(false);
          }).catch((rejectedValueOrSerializedError) => {
            setDisableForm(false);
          }); 
          closeWindow();
          break;
        default:
          break;
      }      
    } catch (error) {
      setDisableForm(false);
    }
  };

  const onError: SubmitErrorHandler<IRegisterDokumen<IDokumenAktaPendirian>> = async (err) => {
    console.log('error', err);
    // if(mode == 'delete') {
    //   await deletePerson(dataLama as IPerson).unwrap().then((originalPromiseResult) => {
    //     setDisableForm(false);
    //   }).catch((rejectedValueOrSerializedError) => {
    //     setDisableForm(false);
    //   }); 
    //   hideModal();
    // }
    // else {
    //   console.log('error', err);
    // }
  };

  const _onDocumentReady = useCallback(
    (e) => {
      // console.log("Document is loaded");
    },
    []
  );

  const _onAppReady = useCallback(
    (e) => {
      // console.log("App is ready");
    },
    []
  );

  const _onError = useCallback(
    (e) => {
      console.log(e);
    },
    []
  );

  return (
    <Stack.Item> 
        <Stack>
          <input type="file" id="fileUpload" style={{display: 'none'}} onChange={_handleFile} />
          { configOnlyOfficeEditor == null && mode == 'add' && !isLoadingUploadFile &&
          <Stack.Item align="center">                          
            <div className={contentStyles.fileViewContainer} onClick={_bindClickEventInputFile}> 
              <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
              <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih file {dokumen?.nama}</Label>
              <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label><br/>
            </div>                        
          </Stack.Item> 
          } 
          { configOnlyOfficeEditor &&
          <Stack.Item>
            <Stack horizontal tokens={stackTokens}>
              <Stack.Item style={{background: 'rgb(241 241 241)', padding: '0px 8px 8px 8px', border: '1px solid rgb(187 190 194)'}}>
                <Stack>
                  <Stack.Item>
                    <Label style={{borderBottom: '1px solid grey', marginBottom: 4}}>Meta file - {dokumen?.nama}</Label>
                  </Stack.Item>
                  {mode != 'add' &&
                    <Stack.Item align="center" style={{background: '#fdab2de6', width: '100%'}}>
                      <Label style={{padding: 4}}>
                        {registerPerusahaan?.perusahaan?.pelakuUsaha != undefined ?
                        `${registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${registerPerusahaan?.perusahaan?.nama}`:
                        `${registerPerusahaan?.perusahaan?.nama}`}

                      </Label>
                    </Stack.Item>
                  }
                  <Stack.Item>
                    <Controller 
                      name="dokumen.tanggal"
                      control={control}
                      render={
                        ({field: {onChange}, fieldState: { error }}) => (                      
                          <DatePicker
                            label="Tgl. penetapan/penerbitan"
                            firstDayOfWeek={firstDayOfWeek}
                            placeholder="Pilih tanggal"
                            ariaLabel="Pilih tanggal"
                            strings={DayPickerIndonesiaStrings}
                            formatDate={utcFormatDateToDDMMYYYY}
                            onSelectDate={
                              (date) => {         
                                onChange(utcFormatDateToYYYYMMDD(date!));
                                setSelectedDate(date!);
                              }
                            }
                            value={selectedDate}
                            disabled={mode == 'delete' ? true:disableForm}
                            styles={dateStyle}
                          />
                        )
                      }
                    />
                  </Stack.Item>
                  <Stack.Item>
                    <Controller 
                      name="dokumen.nomor"
                      control={control}
                      render={
                        ({field: {onChange}, fieldState: { error }}) => (
                          <TextField
                            label="Nomor"
                            placeholder="isikan nomor dokumen"
                            value={nomorTextFieldValue}
                            onChange={
                              (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                if(newValue!.length > 0) {
                                  onChange(newValue!);
                                }
                                else {
                                  resetField("dokumen.nomor");
                                }
                                setNomorTextFieldValue(newValue||'');
                              }
                            }
                            disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                            errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                          />
                        )
                      }
                    />
                  </Stack.Item>         
                  <Stack.Item>
                    <Controller 
                      name="dokumen.namaNotaris"
                      control={control}
                      render={
                        ({field: {onChange, onBlur}, fieldState: { error }}) => (
                          <TextField
                            label="Notaris"
                            placeholder="isikan nama notaris"
                            value={notarisTextFieldValue}
                            onChange={
                              (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
                                if(newValue!.length > 0) {
                                  onChange(newValue!);
                                }
                                else {
                                  resetField("dokumen.namaNotaris");
                                }
                                setNotarisTextFieldValue(newValue || '');
                              }
                            }
                            disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                            errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                          />
                        )
                      }
                    />
                  </Stack.Item>
                  <Stack.Item>
                    <Controller 
                      name="dokumen.penanggungJawab"
                      control={control}
                      render={
                        ({field: {onChange, onBlur}, fieldState: { error }}) => (
                          <ComboBox
                            componentRef={comboBoxPenanggungJawabRef}
                            label="Direktur"
                            placeholder="ketik minimal 3 abjad untuk menampilkan pilihan"
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
                            disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                            errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                          />
                        )
                      }
                    />                
                  </Stack.Item>
                  <PrimaryButton 
                    style={{marginTop: 16, width: '100%'}}
                    text={mode == 'delete' ? 'Hapus dokumen': mode == 'add' ? 'Simpan':'Update meta file'} 
                    onClick={handleSubmit(onSubmit, onError)}
                    disabled={mode == 'delete' ? disableForm : configOnlyOfficeEditor == null ? true : disableForm}
                  />
                  { mode == 'edit' &&
                    <DefaultButton 
                      style={{marginTop: 4, width: '100%'}}
                      text={'Upload ulang dokumen'} 
                      onClick={_bindClickEventInputFile}
                      disabled={configOnlyOfficeEditor == null ? true:disableForm}
                    />
                  }                  
                </Stack>  
              </Stack.Item>
              <Stack.Item>
                <DocumentEditor 
                  id="onlyOfficeEditor"
                  documentServerUrl={urlDocumenService}
                  config={configOnlyOfficeEditor}
                  events_onDocumentReady={_onDocumentReady}
                  events_onAppReady={_onAppReady}
                  events_onError={_onError}
                />
              </Stack.Item>       
            </Stack>            
          </Stack.Item>         
          }     
          {(configOnlyOfficeEditor == null && mode != 'add') || isLoadingUploadFile &&
          <Stack.Item align="center">
            <Label>Please wait...</Label>
            <Spinner size={SpinnerSize.large} />
          </Stack.Item>
          }
        </Stack>        
    </Stack.Item>
  );
}