import { FC, FormEvent, useCallback, useRef, useState } from "react";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { IRegisterDokumen } from "../../features/entity/register-dokumen";
import { IDokumenNibOss } from "../../features/entity/dokumen-nib-oss";
import { DatePicker, DayOfWeek, DefaultButton, FontIcon, IDatePickerStyleProps, IDatePickerStyles, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Spinner, SpinnerSize, Stack, TextField, mergeStyleSets } from "@fluentui/react";
import { useGetOnlyofficeConfigEditorMutation, useReplaceFileMutation, useUploadFileMutation } from "../../features/repository/service/sikoling-api-slice";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { RegisterDokumenNibSchema } from "../../features/schema-resolver/zod-schema";
import cloneDeep from "lodash.clonedeep";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPickerIndonesiaStrings, utcFormatDateToDDMMYYYY, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IKbli } from "../../features/entity/kbli";

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
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? new Date(dataLama.dokumen?.tanggal!):undefined);
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen?.nomor!:'');
  const [listKbli, setListKbli] = useState<IKbli[]>([]);
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const [configOnlyOfficeEditor, setConfigOnlyOfficeEditor] = useState<any|null>(null);
  //ref
  // const comboBoxKbliRef = useRef<IComboBox>(null);
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

  const onSubmit: SubmitHandler<IRegisterDokumen<IDokumenNibOss>> = async (data) => {
    setDisableForm(true);
    try {
      switch (mode) {
        case 'add':          
          // await saveRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // closeWindow();
          break;
        case 'delete':
          // await deleteRegisterDokumen(data).unwrap().then((originalPromiseResult) => {
          //   setDisableForm(false);
          // }).catch((rejectedValueOrSerializedError) => {
          //   setDisableForm(false);
          // }); 
          // closeWindow();
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
            {configOnlyOfficeEditor &&
            <Stack.Item>
              <Stack horizontal tokens={stackTokens}>
                <Stack.Item style={{background: 'rgb(241 241 241)', padding: '0px 8px 8px 8px', border: '1px solid rgb(187 190 194)'}}>
                  <Stack>
                    <Stack.Item>
                      <Label style={{borderBottom: '1px solid grey', marginBottom: 4}}>Meta file</Label>
                    </Stack.Item>
                    <Stack.Item>
                      <Controller 
                        name="dokumen.tanggal"
                        control={control}
                        render={
                          ({field: {onChange}, fieldState: { error }}) => (                      
                            <DatePicker
                              label="Tgl. penerbitan"
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
                              styles={textFieldStyles}
                              errorMessage={error && error.type == 'invalid_type'? 'harus diisi':error?.message}
                            />
                          )
                        }
                      />
                    </Stack.Item>
                    <Stack.Item>
                      <ul>
                        {
                          listKbli?.length > 0 ?
                          listKbli?.map((item, idx) => {
                            return <li key={item.kode}>{item.kode} - {item.nama}</li>;
                          }):null
                        }
                      </ul>
                    </Stack.Item>
                    <PrimaryButton 
                      style={{marginTop: 16, width: '100%'}}
                      text={mode == 'delete' ? 'Hapus dokumen': mode == 'add' ? 'Simpan':'Update meta file'} 
                      onClick={handleSubmit(onSubmit, onError)}
                      disabled={configOnlyOfficeEditor == null ? true : disableForm}
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