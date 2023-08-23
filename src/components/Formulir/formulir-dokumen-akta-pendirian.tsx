import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { z } from "zod";
import { DokumenAktaPendirianSchema, RegisterDokumenSchema } from "../../features/schema-resolver/zod-schema";
import { ComboBox, DatePicker, DayOfWeek, FontIcon, IComboBox, IComboBoxOption, IComboBoxStyles, IDatePickerStyleProps, IDatePickerStyles, ISelectableOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, ScrollablePane, Stack, TextField, mergeStyleSets } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { useDeleteRegisterDokumenMutation, useGetDaftarDataPegawaiQuery, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation } from "../../features/repository/service/sikoling-api-slice";
import { DayPickerIndonesiaStrings, getFileType, utcFormatDateToYYYYMMDD } from "../../features/config/helper-function";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IPegawai } from "../../features/entity/pegawai";
import { utcFormatDateToDDMMYYYY } from "../../features/config/helper-function";
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { urlApiSikoling, urlCallback } from "../../features/config/config";
import { useAppSelector } from "../../app/hooks";
// import { Document, Page, pdfjs } from "react-pdf";
// import type { PDFDocumentProxy } from 'pdfjs-dist';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.js',
//   import.meta.url,
// ).toString();
// const options = {
//   cMapUrl: '/cmaps/',
//   standardFontDataUrl: '/standard_fonts/',
// };

export const RegisterDokumenAktaPendirianSchema = RegisterDokumenSchema.omit({dokumen: true}).extend({dokumen: DokumenAktaPendirianSchema});
export type registerDokumenAktaPendirianSchema = z.infer<typeof RegisterDokumenAktaPendirianSchema>;
interface IFormulirRegisterDokumenAktaPendirianFluentUIProps {
  mode?: string;
  dokumen?: IDokumen;
  registerPerusahaan?: IRegisterPerusahaan;
  dataLama?: registerDokumenAktaPendirianSchema;
};
const stackTokens = { childrenGap: 8 };
const dateStyle: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
  root: {
    width: 130
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
    width: 400,
    height: 230,
    padding: 2,
  },
  iconContainer: {
    fontSize: 32,
    height: 36,
    color: '#DDDCDC',
    margin: '0 25px',
  },
});
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200 } };
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 400 } };

export const FormulirRegisterDokumenAktaPendirian: FC<IFormulirRegisterDokumenAktaPendirianFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama}) => { 
  const token = useAppSelector((state) => state.token);
  //local state
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(dataLama != undefined ? new Date(dataLama.dokumen.tanggal!):undefined); 
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen.nomor!:'');
  const [notarisTextFieldValue, setNotarisTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen.namaNotaris!:'');
  const [selectedKeyPegawai, setSelectedKeyPegawai] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen.penanggungJawab?.id!:undefined);
  const [selectedFiles, setSelectedFiles] = useState<FileList|undefined|null>(undefined);
  const [numPages, setNumPages] = useState<number>();
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
  const [disableForm, setDisableForm] = useState<boolean>(false);
  const comboBoxPenanggungJawabRef = useRef<IComboBox>(null);
  //react hook-form
  const {handleSubmit, control, setValue, resetField} = useForm<registerDokumenAktaPendirianSchema>({
    defaultValues:  dataLama != undefined ? cloneDeep(dataLama) as registerDokumenAktaPendirianSchema:{
      id: null,
      registerPerusahaan: {id: registerPerusahaan?.id!},
      dokumen: {
        id: dokumen?.id!
      }
    },
    resolver: zodResolver(RegisterDokumenAktaPendirianSchema)
  });
  //rtk query
  const [ saveRegisterDokumen, {isLoading: isLoadingSaveRegisterDokumen}] = useSaveRegisterDokumenMutation();
  const [ updateRegisterDokumen, {isLoading: isLoadingUpdateRegisterDokumen}] = useUpdateRegisterDokumenMutation();
  // const [ updateIdRegisterDokumen, {isLoading: isLoadingUpdateIdRegisterDokumen}] = useUpdateIdRegisterDokumenMutation();
  const [ deleteRegisterDokumen, {isLoading: isLoadingDeleteRegisterDokumen}] = useDeleteRegisterDokumenMutation();
  const { data: postsPegawai, isLoading: isLoadingPostsPegawai } = useGetDaftarDataPegawaiQuery(queryPegawaiParams);

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
    },
    [registerPerusahaan, mode]
  );

  const _handleFile = useCallback(
    (event: FormEvent<HTMLInputElement>) => {            
        if(event.currentTarget.files!.length > 0) {            
          let fileType: string = getFileType(event.currentTarget.files![0].type);
          let namaFile: string = event.currentTarget.files![0].name;

          // if(fileType == 'pdf') {
            setSelectedFiles(event.currentTarget.files);
            setValue("lokasiFile", namaFile);
          // }      
        }
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

  const onSubmit: SubmitHandler<registerDokumenAktaPendirianSchema> = async (data) => {
    setDisableForm(true);
    try {
      let formData = new FormData();
      switch (mode) {
        case 'add':          
          // formData.append('imageKtp', selectedFiles?.item(0)!);
          // formData.append('personData', JSON.stringify(data));
          // await savePerson(formData).unwrap().then((originalPromiseResult) => {
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

  const onError: SubmitErrorHandler<registerDokumenAktaPendirianSchema> = async (err) => {
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
      console.log("Document is loaded");
    },
    []
  );

  const _onAppReady = useCallback(
    (e) => {
      console.log("App is ready");
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
        <Stack style={{border: '1px solid #e1dfdf', padding: '0px 8px 8px 8px', minHeight: 800}}>
          <Stack.Item>
            <Stack horizontal tokens={stackTokens}>
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
                            // onChange(utcFormatDateToYYYYMMDD(date!));
                            setSelectedDate(date!);
                          }
                        }
                        value={selectedDate}
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
                        styles={textFieldStyles}
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
                        label="Penanggung jawab"
                        placeholder="ketik minimal 3 abjad untuk menampilkan pilihan"
                        allowFreeform={true}
                        options={optionsPegawai != undefined ? optionsPegawai:[]}
                        selectedKey={selectedKeyPegawai != undefined ? selectedKeyPegawai:null}
                        useComboBoxAsMenuWidth={true}
                        onRenderOption={_onRenderPegawaiOption}   
                        onInputValueChange={_onInputComboBoxPegawaiValueChange}      
                        styles={basicComboBoxStyles}          
                        onChange={(event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string) => {
                          let penanggungJawab = cloneDeep(postsPegawai?.at(index!));
                          onChange(penanggungJawab);
                          setSelectedKeyPegawai(option?.key as string);
                        }}
                        disabled={mode == 'delete'||selectedDate==undefined ? true:disableForm}
                      />
                    )
                  }
                />                
              </Stack.Item>
            </Stack>  
          </Stack.Item> 
          <Stack.Item>
            <Controller 
              name="lokasiFile"
              control={control}
              render={
                ({field: {onChange, onBlur}, fieldState: { error }}) => (
                  <input type="file" id="fileUpload" style={{display: 'none'}} onChange={_handleFile} />
                )
              }
            />    
            { selectedFiles == undefined &&
              <div className={contentStyles.fileViewContainer} onClick={_bindClickEventInputFile}> 
                <FontIcon aria-label="Icon" iconName="OpenFile" className={contentStyles.iconContainer}/>
                <Label disabled style={{paddingBottom: 0}}>Clik untuk memilih file akta pendirian</Label>
                <Label disabled style={{paddingTop: 0}}>(ukuran maksimal file 4MB)</Label><br/>
              </div>
            } 
            { selectedFiles &&
              <DocumentEditor 
                id="docxEditor"
                documentServerUrl="http://localhost/"
                config={{
                  document: {
                    fileType: "doc",
                    key: "Khirz6zTPdfd7",
                    title: "Example Document Title.docx",
                    url: `${urlApiSikoling}/files/onlyoffice/BAB A Tower.doc`
                  },
                  documentType: "word",
                  editorConfig: {
                    callbackUrl: urlCallback
                  },
                  token: token.accessToken!
                }}
                events_onDocumentReady={_onDocumentReady}
                events_onAppReady={_onAppReady}
                events_onError={_onError}
              />
            }
          </Stack.Item>       
        </Stack>
        <PrimaryButton 
          style={{marginTop: 16, width: '100%'}}
          text={mode == 'delete' ? 'Hapus':'Simpan'} 
          onClick={handleSubmit(onSubmit, onError)}
          disabled={selectedDate == undefined ? true:disableForm}
        />
    </Stack.Item>
  );
}