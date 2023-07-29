import { FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import { z } from "zod";
import { DokumenAktaPendirianSchema, RegisterDokumenSchema } from "../../features/schema-resolver/zod-schema";
import { ComboBox, DatePicker, DayOfWeek, IComboBox, IComboBoxOption, IComboBoxStyles, IDatePickerStyleProps, IDatePickerStyles, ISelectableOption, IStyleFunctionOrObject, ITextFieldStyles, Label, PrimaryButton, Stack, TextField } from "@fluentui/react";
import cloneDeep from "lodash.clonedeep";
import { Controller, SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDokumen } from "../../features/entity/dokumen";
import { IRegisterPerusahaan } from "../../features/entity/register-perusahaan";
import { useDeleteRegisterDokumenMutation, useGetDaftarDataPegawaiQuery, useSaveRegisterDokumenMutation, useUpdateRegisterDokumenMutation } from "../../features/repository/service/sikoling-api-slice";
import { DayPickerIndonesiaStrings, onFormatDate } from "../../features/config/config";
import { IQueryParamFilters } from "../../features/entity/query-param-filters";
import { IPegawai } from "../../features/entity/pegawai";

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
const textFieldStyles: Partial<ITextFieldStyles> = { fieldGroup: { width: 200 } };
const basicComboBoxStyles: Partial<IComboBoxStyles> = { root: { minWidth: 400 } };

export const FormulirRegisterDokumenAktaPendirian: FC<IFormulirRegisterDokumenAktaPendirianFluentUIProps> = ({mode, dokumen, registerPerusahaan, dataLama}) => { 
  //local state
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(DayOfWeek.Sunday);
  const [selectedDate, setSelectedDate] = useState<Date|undefined>(undefined); 
  const [nomorTextFieldValue, setNomorTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen.nomor!:'');
  const [notarisTextFieldValue, setNotarisTextFieldValue] = useState<string>(dataLama != undefined ? dataLama.dokumen.namaNotaris!:'');
  const [selectedKeyPegawai, setSelectedKeyPegawai] = useState<string|undefined>(dataLama != undefined ? dataLama.dokumen.penanggungJawab?.id!:undefined);
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
  const {handleSubmit, control, setValue, resetField, watch} = useForm<registerDokumenAktaPendirianSchema>({
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
        setSelectedKeyPegawai(undefined);
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
    [registerPerusahaan]
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

  return (
    <Stack.Item> 
        <Stack style={{border: '1px solid #e1dfdf', padding: '0px 8px 8px 8px'}}>
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
                        formatDate={onFormatDate}
                        styles={dateStyle}
                        onSelectDate={
                          (date) => {         
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
                        disabled={mode == 'delete' ? true:disableForm}
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
                        disabled={mode == 'delete' ? true:disableForm}
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
                        disabled={mode == 'delete' ? true:disableForm}
                      />
                    )
                  }
                />                
              </Stack.Item>
            </Stack>  
          </Stack.Item> 
          <Stack.Item>
            Area upload dokumen
          </Stack.Item>       
        </Stack>
        <PrimaryButton 
          style={{marginTop: 16, width: '100%'}}
          text={mode == 'delete' ? 'Hapus':'Simpan'} 
          onClick={handleSubmit(onSubmit, onError)}
          disabled={disableForm}
        />
    </Stack.Item>
  );
}