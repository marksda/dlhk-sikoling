import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";
import { ComboBox, DatePicker, DayOfWeek, DefaultButton, FontIcon, IComboBox, IComboBoxOption, IDatePickerStyleProps, IDatePickerStyles, IDropdownOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Spinner, SpinnerSize, Stack, TextField, mergeStyleSets } from "@fluentui/react";
import { sikolingApi, useDeleteFileMutation, useDeleteRegisterDokumenMutation, useGetDaftarDataKbliQuery, useGetOnlyofficeConfigEditorMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { RegisterDokumenNibSchema } from "../../features/schema-resolver/zod-schema";
import cloneDeep from "lodash.clonedeep";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPickerIndonesiaStrings, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IKbli } from "../../features/entity/kbli";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlApiSikoling, urlDocumenService } from "../../features/config/config";
import axios from "axios";
import { IToken } from "../../features/entity/token";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { resetToken, setToken } from "../../features/security/token-slice";
import { Mutex } from "async-mutex";

interface IFormulirRegisterDokumenNibOssFluentUIProps {
    mode?: string;
    dokumen?: IDokumen;
    registerPerusahaan?: IRegisterPerusahaan;
    dataLama?: IRegisterDokumen<IDokumenNibOss>;
    closeWindow: () => void;
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
  kbliContainer: {
    border: '1px solid grey',
    marginTop: 2,
    padding: '4px 4px 4px 8px',
    background: 'white',
    minHeight: 90,
    width: 370,
    maxHeight: 250,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  spanDelete: {
    color: 'red',
    cursor: 'pointer',
  }
});
const stackTokens = { childrenGap: 4 };
const dateStyle: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
  root: {
    width: 200
  }
};
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200 } };
const mutexDokumenNib = new Mutex();

export const FormulirRegisterDokumenNibOss: FC<IFormulirRegisterDokumenNibOssFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => { 
  const token = useAppSelector((state) => state.token); 
  const dispatch = useAppDispatch();
  
  const [tempFile, setTempFile] = useState<string|null>(null);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? dataLama.dokumen?.tanggal != undefined ? new Date(dataLama.dokumen?.tanggal!):undefined:undefined);
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.nomor!:'');
  const [daftarKbliSelected, setDaftarKbliSelected] = useState<Partial<IKbli>[]>(dataLama != undefined ? cloneDeep(dataLama.dokumen?.daftarKbli!):[]);
  const [queryParamsKbli, setQueryParamsKbli] = useState<IQueryParamFilters>({
    pageNumber: 1,
    pageSize: 30,
    filters: [],
    sortOrders: [
        {
          fieldName: 'kode',
          value: 'ASC'
        },
    ],
  });
  const [disableForm, setDisableForm] = useState<boolean>(mode == 'delete' ? false:true);
  const [configOnlyOfficeEditor, setConfigOnlyOfficeEditor] = useState<any|null>(null);
  //ref
  const comboBoxKbliRef = useRef<IComboBox>(null);
  //react form hook
  const {handleSubmit, control, setValue, resetField} = useForm<IRegisterDokumen<IDokumenNibOss>>({
      defaultValues:  dataLama != undefined ? cloneDeep(dataLama):{
        id: null,
        registerPerusahaan: {id: registerPerusahaan?.id},
        dokumen: {...dokumen}
      },
      resolver: zodResolver(RegisterDokumenNibSchema)
  });
  //rtk query
  const [ uploadFile, {isLoading: isLoadingUploadFile}] = useUploadFileMutation();
  const [ deleteFile, {isLoading: isLoadingDeleteFile}] = useDeleteFileMutation();
  const [ getOnlyofficeConfigEditor, {isLoading: isLoadingGetOnlyofficeConfigEditor}] = useGetOnlyofficeConfigEditorMutation();
  const { data: listKbli, isFetching: isFetchingDataKbli, isError: isErrorKbli } = useGetDaftarDataKbliQuery(queryParamsKbli);
  const [ saveRegisterDokumen, {isLoading: isLoadingSaveRegisterDokumen}] = useSaveRegisterDokumenMutation();
  const [ updateRegisterDokumen, {isLoading: isLoadingUpdateRegisterDokumen}] = useUpdateRegisterDokumenMutation();
  const [ deleteRegisterDokumen, {isLoading: isLoadingDeleteRegisterDokumen}] = useDeleteRegisterDokumenMutation();

  const kbliOptions: IDropdownOption<any>[] = useMemo(
    () => {
        if(listKbli != undefined) {
            return [
                ...listKbli.map(
                    (t) => ({
                        key: t.kode!,
                        text: `${t.kode} - ${t.nama}`,
                        data: t,
                    })
                )
            ];
        }
        else {
            return [];
        }
    },
    [listKbli]
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

  useEffect(
    () => {
      if(mode != 'add') {
        // setQueryPegawaiParams(
        //   prev => {
        //       let tmp = cloneDeep(prev);
        //       let filters = cloneDeep(tmp.filters);
        //       let found = filters?.findIndex((obj) => {return obj.fieldName == 'perusahaan_id'}) as number;                   
              
        //       if(found == -1) {
        //           filters?.push({
        //               fieldName: 'perusahaan_id',
        //               value: dataLama?.registerPerusahaan?.id!
        //           });
        //       }
        //       else {
        //           filters?.splice(found, 1, {
        //               fieldName: 'perusahaan_id',
        //               value: dataLama?.registerPerusahaan?.id!
        //           })
        //       }
              
        //       tmp.pageNumber = 1;
        //       tmp.filters = filters;             
        //       return tmp;
        //   }
        // );

        getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${dataLama?.lokasiFile}`).unwrap()
          .then((secondPromiseResult) => {
            setDisableForm(false);
            let hasil = cloneDeep(secondPromiseResult);
            hasil.height = `${window.innerHeight - 130}px`;  
            hasil.width =  `${window.innerWidth - 520}px`;                 
            setConfigOnlyOfficeEditor(hasil);
          })
          .catch((rejectedValueOrSerializedError) => {
            console.log(rejectedValueOrSerializedError);
            setDisableForm(false);
          });
      }
    },
    [mode, dataLama]
  );

  useEffect(
    () => {
      function handleResize() {
        setConfigOnlyOfficeEditor(
          (prev: any) => {
            let hasil = cloneDeep(prev);
            hasil.height = mode == 'add' ? `${window.innerHeight - 195}px` : `${window.innerHeight - 130}px`;
            hasil.width = `${window.innerWidth - 520}px`; 
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
  
  const _bindClickEventInputFile = useCallback(
    (e) => {            
        e.stopPropagation();
        // if(!disableForm) {
          document.getElementById('fileUpload')!.click();
        // }        
    },
    [disableForm]
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
                        hasil.width =  `${window.innerWidth - 520}px`; 

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
                parm = {
                  subPath: `/file/replace?fileNameParam=${namaFile}`,
                  dataForm: formData
                };                 
                const btnElm = document.getElementById("btnUploadDokumenNib") as HTMLButtonElement;
                const parentElm = btnElm?.parentElement;
                const progressElm = document.createElement("progress");
                progressElm.setAttribute("value", "0");
                progressElm.setAttribute("max", "1");
                progressElm.style.width = "100%";
                progressElm.style.marginTop = "16px";
                parentElm?.append(progressElm);
                const uriLocator = `${urlApiSikoling}/file/replace?fileNameParam=${namaFile}`;
                _uploadDokumen(uriLocator, formData, token, progressElm);
                // replaceFile(parm).unwrap()
                //   .then((firstPromiseResult) => {
                //     setValue("lokasiFile", firstPromiseResult.uri);
                //     getOnlyofficeConfigEditor(`/onlyoffice/config?fileNameParam=${firstPromiseResult.uri}`).unwrap()
                //       .then((secondPromiseResult) => {
                //         setDisableForm(false);
                //         let hasil = cloneDeep(secondPromiseResult);
                //         hasil.height = `${window.innerHeight - 195}px`;            
                //         hasil.width =  `${window.innerWidth - 310}px`; 
                //         setConfigOnlyOfficeEditor(hasil);
                //       })
                //       .catch((rejectedValueOrSerializedError) => {
                //         setDisableForm(false);
                //       });
                //   })
                //   .catch((rejectedValueOrSerializedError) => {
                //     setDisableForm(false);
                //   }); 
                break;
              default:
                break;
            }
          }
      },
      [mode, dataLama]
  );

  const inputKbliChange = useCallback(
    (newValue: string) => {
      if(newValue.length > 1) {
        comboBoxKbliRef.current?.focus(true);
        setQueryParamsKbli(
          prev => {
              let tmp = cloneDeep(prev);
              let filters = cloneDeep(tmp.filters);
              let found = filters?.findIndex((obj) => {return obj.fieldName == 'kode'}) as number;     
              
              if(newValue != '') {
                  if(found == -1) {
                      filters?.push({
                          fieldName: 'kode',
                          value: newValue
                      });
                  }
                  else {
                      filters?.splice(found, 1, {
                          fieldName: 'kode',
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
    [comboBoxKbliRef],
  );

  const kbliItemClick = useCallback(
    (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number) => {  
      setDaftarKbliSelected((prev) => {
        let tmpDaftarKbli = cloneDeep(prev);
        let found = tmpDaftarKbli?.findIndex((obj) => {return obj.kode == option!.data.kode}) as number;
        if(found == -1) {
          tmpDaftarKbli.push(option!.data);
          setValue('dokumen.daftarKbli', tmpDaftarKbli);
        }
        return tmpDaftarKbli;
      });
    },
    [],
  );

  const onSubmit: SubmitHandler<IRegisterDokumen<IDokumenNibOss>> = async (data) => {
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

  const onError: SubmitErrorHandler<IRegisterDokumen<IDokumenNibOss>> = async (err) => {
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

  const handleDeleteItemKbli = useCallback(
    (e) => {  
      if(mode != 'delete') {
        setDaftarKbliSelected((prev) => {
          let tmpDaftarKbli = cloneDeep(prev);
          let found = tmpDaftarKbli?.findIndex((obj) => {return obj.kode == e.target.dataset.kode}) as number;
          if(found > -1) {
            tmpDaftarKbli?.splice(found, 1);
            setValue('dokumen.daftarKbli', tmpDaftarKbli);
          }        
          return tmpDaftarKbli;
        });
      }
    },
    [mode],
  );

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
        hasil.width =  `${window.innerWidth - 520}px`; 
        setConfigOnlyOfficeEditor(hasil);
        progressElm.remove();
      }).catch((rejectedValueOrSerializedError) => {
        setDisableForm(false);
        progressElm.remove();
      });    
      dispatch(sikolingApi.util.invalidateTags(["RegisterDokumen"]));  
    }).catch(async (error) => {   
      if(error.response.status == 401) {
          if (!mutexDokumenNib.isLocked()) {
              const release = await mutexDokumenNib.acquire();
              const refreshTokenUriLocator = `${urlApiSikoling}/user/refresh_token/${token.userName}`;
              try {
                  _refreshToken(refreshTokenUriLocator, uriUploadLocator, dataForm, progressElm);

              } catch (error) {
                  release();
              }
          }   
          else {
              await mutexDokumenNib.waitForUnlock();
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
        mutexDokumenNib.release();
    }).catch((errorRefreshToken) => {
        localStorage.removeItem('token');
        dispatch(resetToken());
        mutexDokumenNib.release();
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
            {configOnlyOfficeEditor != null &&
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
                              styles={dateStyle}
                              onSelectDate={
                                (date) => {         
                                  onChange(utcFormatDateToYYYYMMDD(date!));
                                  setSelectedDate(date!);
                                }
                              }
                              value={selectedDate}
                              disabled={mode == 'delete' ? true:disableForm}
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
                              label="NIB"
                              placeholder="isikan nib"
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
                              styles={textFieldStyles}
                              errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                            />
                          )
                        }
                      />
                    </Stack.Item>
                    <Stack.Item>
                      <ComboBox 
                        label="Daftar kbli"
                        placeholder="ketik minimal 2 digit pertama kode kbli, lalu pilih"
                        selectedKey={null}
                        dropdownMaxWidth={550}
                        allowFreeform={true}
                        autoComplete="off"
                        options={kbliOptions}
                        onInputValueChange={inputKbliChange}
                        onItemClick={kbliItemClick}
                        disabled={mode == 'delete' ? true : selectedDate ? disableForm : true}
                      />                       
                      <div className={contentStyles.kbliContainer} style={{background: selectedDate == undefined ? 'rgb(241 241 241)' : mode == 'delete' ? 'rgb(241 241 241)':'white'}}>
                        {
                          daftarKbliSelected?.length > 0 ?
                          daftarKbliSelected?.map((item, idx) => {
                            return <Label key={item.kode}>{item.kode} - {item.nama} {mode != 'delete' ? <span data-kode={item.kode} className={contentStyles.spanDelete} title="Klik untuk menghapus item ini" onClick={handleDeleteItemKbli}>[x]</span>:null}</Label>;
                          }):null
                        }
                      </div>      
                    </Stack.Item>
                    <PrimaryButton 
                      style={{marginTop: 16, width: '100%'}}
                      text={mode == 'delete' ? 'Hapus dokumen': mode == 'add' ? 'Simpan':'Update meta file'} 
                      disabled={mode == 'delete' ? disableForm : configOnlyOfficeEditor == null ? true:disableForm}
                      onClick={handleSubmit(onSubmit, onError)}
                    />
                    { mode == 'edit' &&
                      <DefaultButton 
                        id="btnUploadDokumenNib"
                        style={{marginTop: 4, width: '100%'}}
                        text={'Upload ulang dokumen'} 
                        onClick={_bindClickEventInputFile}
                        disabled={configOnlyOfficeEditor == null ? true:disableForm}
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