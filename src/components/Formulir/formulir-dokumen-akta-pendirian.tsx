import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { ComboBox, DatePicker, DayOfWeek, DefaultButton, FontIcon, IComboBox, IComboBoxOption, IComboBoxStyles, IDatePickerStyleProps, IDatePickerStyles, ISelectableOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Spinner, SpinnerSize, Stack, TextField, Toggle, mergeStyleSets } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sikolingApi, useDeleteFileMutation, useDeleteRegisterDokumenMutation, useGetDaftarDataPegawaiQuery, useGetOnlyofficeConfigEditorMutation, useReplaceFileMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { DayPickerIndonesiaStrings, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IPegawai } from "../../features/entity/pegawai";
import { utcFormatDateToDDMMYYYY } from "../../features/config/helper-function";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlApiSikoling, urlDocumenService } from "../../features/config/config";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenAktaPendirian } from "../../features/entity/dokumen-akta-pendirian";
import { RegisterDokumenAktaPendirianSchema } from "../../features/schema-resolver/zod-schema";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IDokumen } from "../../features/entity/dokumen";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import axios from "axios";
import { IToken } from "../../features/entity/token";
import { Mutex } from "async-mutex";
import { resetToken, setToken } from "../../features/security/token-slice";


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
const toggleStyles = {
  root: {
      marginBottom: 0,
      width: '150px',
  },
};
const mutexDokumenAktaPendirian = new Mutex();

export const FormulirRegisterDokumenAktaPendirian: FC<IFormulirRegisterDokumenAktaPendirianFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => {
  const token = useAppSelector((state) => state.token); 
  const dispatch = useAppDispatch();

  const [tempFile, setTempFile] = useState<string|null>(null);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? new Date(dataLama.dokumen?.tanggal!):undefined); 
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.nomor!:'');
  const [notarisTextFieldValue, setNotarisTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.namaNotaris!:'');
  const [selectedKeyPegawai, setSelectedKeyPegawai] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen?.penanggungJawab?.id!:undefined);
  const [isApproved, setIsApproved] = useState<boolean>(dataLama != undefined ? dataLama.statusVerified!:false);
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
  const [ deleteFile, {isLoading: isLoadingDeleteFile}] = useDeleteFileMutation();
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

  const officeEditor = useMemo(
    () => {
        if(configOnlyOfficeEditor != null) {
            return <DocumentEditor 
                id="onlyOfficeEditor"
                documentServerUrl={urlDocumenService}
                config={configOnlyOfficeEditor}
            />;
        }
    },
    [configOnlyOfficeEditor]
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
  
  useEffect(
    () => {
      return () => {
        if(tempFile != null && mode == "add") {
          let pathFile = "/file/delete?fileNameParam=" + decodeURIComponent(tempFile.split("=")[1]);
          deleteFile(pathFile);
        }
      }      
    },
    [tempFile, mode]
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
                      hasil.width =  `${window.innerWidth - 360}px`; 

                      setTempFile(hasil.document.url);
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
              const btnElm = document.getElementById("btnUploadAkta") as HTMLButtonElement;
              const parentElm = btnElm?.parentElement;
              const progressElm = document.createElement("progress");
              progressElm.setAttribute("value", "0");
              progressElm.setAttribute("max", "1");
              progressElm.style.width = "100%";
              progressElm.style.marginTop = "16px";
              parentElm?.append(progressElm);
              const uriLocator = `${urlApiSikoling}/file/replace?fileNameParam=${namaFile}`;
              _uploadDokumen(uriLocator, formData, token, progressElm);
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

  const _onChangeApproved = useCallback(
    (ev: React.MouseEvent<HTMLElement>, checked?: boolean|undefined): void => { 
      setValue("statusVerified", checked!);             
      setIsApproved(checked!);  
    },
    []
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

  async function _uploadDokumen(uriUploadLocator: string, dataForm:FormData, _token: IToken, progressElm: HTMLProgressElement) {
    setDisableForm(true);

    axios({
      url: uriUploadLocator, 
      method: 'POST',
      responseType: 'json', 
      data: dataForm,
      headers: {
          Authorization: `Bearer ${_token.accessToken}` 
      },
      onUploadProgress: progressEvent => {
          progressElm.setAttribute("value", `${progressEvent.progress}`);
      }                
    }).then((response) => {      
      setValue("lokasiFile", response.data.uri);   
      getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${response.data.uri}`).unwrap().then((secondPromiseResult) => {
        setDisableForm(false);
        let hasil = cloneDeep(secondPromiseResult);
        hasil.height = `${window.innerHeight - 195}px`;            
        hasil.width =  `${window.innerWidth - 360}px`; 
        setConfigOnlyOfficeEditor(hasil);
        progressElm.remove();
      }).catch((rejectedValueOrSerializedError) => {
        setDisableForm(false);
        progressElm.remove();
      });    
      dispatch(sikolingApi.util.invalidateTags(["RegisterDokumen"]));  
    }).catch(async (error) => {   
      if(error.response.status == 401) {
          if (!mutexDokumenAktaPendirian.isLocked()) {
              const release = await mutexDokumenAktaPendirian.acquire();
              const refreshTokenUriLocator = `${urlApiSikoling}/user/refresh_token/${token.userName}`;
              try {
                  _refreshToken(refreshTokenUriLocator, uriUploadLocator, dataForm, progressElm);

              } catch (error) {
                  release();
              }
          }   
          else {
              await mutexDokumenAktaPendirian.waitForUnlock();
              _uploadDokumen(uriUploadLocator, dataForm, token, progressElm);
          }                  
      }
      else {
          progressElm.remove();
          alert("File gagal direupload");
      }
    });
  };

  function _refreshToken(refreshTokenUriLocator: string, uriUploadLocator: string, dataForm:FormData, progressElm: HTMLProgressElement) {
    axios({
        url: refreshTokenUriLocator, 
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        responseType: 'json',
        data: token.refreshToken      
    }).then((responseRefreshToken) => {                 
        const hasil = responseRefreshToken.data
        localStorage.removeItem('token');
        localStorage.setItem('token', JSON.stringify(hasil.token));
        dispatch(setToken(hasil.token));
        _uploadDokumen(uriUploadLocator, dataForm, hasil.token, progressElm);
        mutexDokumenAktaPendirian.release();
    }).catch((errorRefreshToken) => {
        localStorage.removeItem('token');
        dispatch(resetToken());
        mutexDokumenAktaPendirian.release();
    });
  };

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
                              disabled={mode == 'delete' ? true:disableForm}
                            />
                        </Stack.Item>
                    </Stack>
                  </Stack.Item>:null        
                  }   
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
                      id="btnUploadAkta"
                    />
                  }                  
                </Stack>  
              </Stack.Item>
              <Stack.Item>
                {officeEditor}
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