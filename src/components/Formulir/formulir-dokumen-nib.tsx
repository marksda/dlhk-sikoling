import { FC, FormEvent, MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";
import { ComboBox, DatePicker, DayOfWeek, DefaultButton, DetailsList, DetailsListLayoutMode, FontIcon, IColumn, IComboBox, IComboBoxOption, IDatePickerStyleProps, IDatePickerStyles, IDropdownOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, ScrollablePane, SelectionMode, Spinner, SpinnerSize, Stack, TextField, mergeStyleSets } from "@fluentui/react";
import { useDeleteRegisterDokumenMutation, useGetDaftarDataKbliQuery, useGetOnlyofficeConfigEditorMutation, useReplaceFileMutation, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { RegisterDokumenNibSchema } from "../../features/schema-resolver/zod-schema";
import cloneDeep from "lodash.clonedeep";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPickerIndonesiaStrings, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IKbli } from "../../features/entity/kbli";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlDocumenService } from "../../features/config/config";

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

export const FormulirRegisterDokumenNibOss: FC<IFormulirRegisterDokumenNibOssFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama, closeWindow}) => { 
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
  const [ replaceFile, {isLoading: isLoadingReplaceFile}] = useReplaceFileMutation();
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
  
  const _bindClickEventInputFile = useCallback(
    (e) => {            
        e.stopPropagation();
        if(!disableForm) {
          document.getElementById('fileUpload')!.click();
        }        
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
                  subPath: `/file/upload?fileNameParam=/nib_oss/temp/${namaFile}`,
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
            { configOnlyOfficeEditor == null && mode == 'add' &&
            <Stack.Item align="center">                          
              <div className={contentStyles.fileViewContainer} onClick={_bindClickEventInputFile}> 
                <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih file akta pendirian</Label>
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
                      <Label style={{borderBottom: '1px solid grey', marginBottom: 4}}>Meta file - {dataLama?.dokumen?.nama}</Label>
                    </Stack.Item>
                    {mode != 'add' &&
                    <Stack.Item align="center" style={{background: '#fdab2de6', width: '100%'}}>
                      <Label style={{padding: 4}}>
                        {dataLama?.registerPerusahaan?.perusahaan?.pelakuUsaha != undefined ?
                        `${dataLama?.registerPerusahaan?.perusahaan?.pelakuUsaha?.singkatan}. ${dataLama?.registerPerusahaan?.perusahaan?.nama}`:
                        `${dataLama?.registerPerusahaan?.perusahaan?.nama}`}

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
            {configOnlyOfficeEditor == null && mode != 'add' &&
            <Stack.Item align="center">
              <Label>Please wait...</Label>
              <Spinner size={SpinnerSize.large} />
            </Stack.Item>
            }
          </Stack>
      </Stack.Item>
  );
}